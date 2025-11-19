import express from 'express';
import prisma from '../prismadb.js';
import { validate, initiatePaymentSchema } from '../middleware/validation.js';
import { paymentLimiter } from '../middleware/rateLimiters.js';
import mpesaService from '../services/mpesa.js';

const router = express.Router();

router.post('/initiate', paymentLimiter, validate(initiatePaymentSchema), async (req, res) => {
  try {
    const { bookingId, phoneNumber } = req.body;

    if (!bookingId || !phoneNumber) {
      return res.status(400).json({ error: 'Booking ID and phone number are required' });
    }

    const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const facility = await prisma.clinic.findUnique({ where: { id: booking.facilityId } });
    if (!facility) {
      return res.status(404).json({ error: 'Facility not found' });
    }

    mpesaService.calculateRevenueSplit(booking.consultationFee);

    const stkPushResult = await mpesaService.initiateSTKPush(
      phoneNumber,
      booking.consultationFee,
      booking.id,
      `Consultation at ${booking.facilityName}`,
    );

    const payment = await prisma.payment.create({
      data: {
        bookingId,
        amount: booking.consultationFee,
        phoneNumber: mpesaService.formatPhoneNumber(phoneNumber),
        status: 'PENDING',
        checkoutRequestId: stkPushResult.checkoutRequestId,
        transactionId: stkPushResult.merchantRequestId,
      },
    });

    await prisma.booking.update({
      where: { id: bookingId },
      data: { paymentStatus: 'PENDING' },
    });

    res.json({
      message: 'STK Push initiated successfully',
      payment: {
        id: payment.id,
        checkoutRequestId: stkPushResult.checkoutRequestId,
        amount: payment.amount,
        status: payment.status,
      },
      instructions: stkPushResult.customerMessage || 'Please check your phone and enter your M-Pesa PIN to complete the payment',
    });
  } catch (error) {
    console.error('Payment initiation error:', error);
    res.status(500).json({ error: error.message || 'Failed to initiate payment' });
  }
});

router.post('/mpesa/callback', async (req, res) => {
  try {
    console.log('M-Pesa Callback received:', JSON.stringify(req.body, null, 2));

    const { Body } = req.body;
    const stkCallback = Body?.stkCallback;

    if (!stkCallback) {
      return res.status(400).json({ error: 'Invalid callback data' });
    }

    const { CheckoutRequestID, ResultCode, ResultDesc } = stkCallback;

    const payment = await prisma.payment.findUnique({
      where: { checkoutRequestId: CheckoutRequestID },
    });

    if (!payment) {
      console.error('No payment found for CheckoutRequestID:', CheckoutRequestID);
      return res.json({ ResultCode: 0, ResultDesc: 'Accepted' });
    }

    if (ResultCode === 0) {
      const callbackMetadata = stkCallback.CallbackMetadata?.Item || [];
      const receiptItem = callbackMetadata.find(item => item.Name === 'MpesaReceiptNumber');

      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: 'PAID',
          mpesaReceiptNumber: receiptItem?.Value || null,
          completedAt: new Date(),
        },
      });

      await prisma.booking.update({
        where: { id: payment.bookingId },
        data: {
          paymentStatus: 'PAID',
          status: 'CONFIRMED',
        },
      });

      console.log('Payment successful:', {
        id: payment.id,
        mpesaReceiptNumber: receiptItem?.Value,
      });
    } else {
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: 'FAILED',
          failureReason: ResultDesc,
        },
      });

      await prisma.booking.update({
        where: { id: payment.bookingId },
        data: { paymentStatus: 'FAILED' },
      });

      console.log('Payment failed:', { id: payment.id, reason: ResultDesc });
    }

    res.json({ ResultCode: 0, ResultDesc: 'Accepted' });
  } catch (error) {
    console.error('Callback processing error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:id/status', async (req, res) => {
  try {
    const payment = await prisma.payment.findUnique({ where: { id: req.params.id } });
    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    res.json({
      id: payment.id,
      status: payment.status,
      amount: payment.amount,
      mpesaReceiptNumber: payment.mpesaReceiptNumber,
      completedAt: payment.completedAt,
      failureReason: payment.failureReason,
      splitProcessed: payment.splitProcessed,
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
});

router.get('/checkout/:checkoutRequestId', async (req, res) => {
  try {
    const payment = await prisma.payment.findUnique({
      where: { checkoutRequestId: req.params.checkoutRequestId },
    });

    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    res.json({
      id: payment.id,
      status: payment.status,
      amount: payment.amount,
      mpesaReceiptNumber: payment.mpesaReceiptNumber,
      completedAt: payment.completedAt,
      failureReason: payment.failureReason,
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
});

export default router;

