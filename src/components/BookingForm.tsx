import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Clock, User, Mail, Phone } from "lucide-react";
import { toast } from "sonner";

interface BookingFormProps {
  language: 'en' | 'sw';
}

export const BookingForm = ({ language }: BookingFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    doctor: "",
    reason: "",
  });

  const content = {
    en: {
      title: "Book an Appointment",
      description: "Schedule a visit with our healthcare professionals",
      name: "Full Name",
      email: "Email Address",
      phone: "Phone Number",
      date: "Preferred Date",
      time: "Preferred Time",
      doctor: "Select Doctor/Specialist",
      reason: "Reason for Visit",
      submit: "Book Appointment",
      submitting: "Booking...",
      success: "Appointment booked successfully!",
      error: "Please fill in all fields",
    },
    sw: {
      title: "Weka Miadi",
      description: "Panga ziara na wataalamu wetu wa afya",
      name: "Jina Kamili",
      email: "Barua Pepe",
      phone: "Nambari ya Simu",
      date: "Tarehe Unayopendelea",
      time: "Muda Unaopendelea",
      doctor: "Chagua Daktari/Mtaalamu",
      reason: "Sababu ya Ziara",
      submit: "Weka Miadi",
      submitting: "Inaweka...",
      success: "Miadi imewekwa kwa mafanikio!",
      error: "Tafadhali jaza sehemu zote",
    },
  };

  const t = content[language];

  const doctors = language === 'en' 
    ? ["Dr. Sarah Kamau - General Practice", "Dr. James Ochieng - Pediatrics", "Dr. Mary Wanjiku - Maternal Health"]
    : ["Dk. Sarah Kamau - Matibabu ya Jumla", "Dk. James Ochieng - Watoto", "Dk. Mary Wanjiku - Afya ya Mama"];

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (Object.values(formData).some(value => !value)) {
      toast.error(t.error);
      return;
    }

    setIsSubmitting(true);
    
    // Simulate booking
    setTimeout(() => {
      toast.success(t.success);
      setIsSubmitting(false);
      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        date: "",
        time: "",
        doctor: "",
        reason: "",
      });
    }, 1500);
  };

  return (
    <section id="book-doctor" className="py-20 bg-muted/30">
      <div className="container px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
              {t.title}
            </h2>
            <p className="text-muted-foreground">
              {t.description}
            </p>
          </div>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>{t.title}</CardTitle>
              <CardDescription>{t.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      {t.name}
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder={language === 'en' ? "John Doe" : "Jina Kamili"}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      {t.phone}
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+254 712 345 678"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    {t.email}
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder={language === 'en' ? "john@example.com" : "barua@mfano.com"}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date" className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {t.date}
                    </Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="time" className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {t.time}
                    </Label>
                    <Input
                      id="time"
                      type="time"
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="doctor">{t.doctor}</Label>
                  <Select
                    value={formData.doctor}
                    onValueChange={(value) => setFormData({ ...formData, doctor: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={language === 'en' ? "Choose a doctor" : "Chagua daktari"} />
                    </SelectTrigger>
                    <SelectContent>
                      {doctors.map((doctor, index) => (
                        <SelectItem key={index} value={doctor}>
                          {doctor}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reason">{t.reason}</Label>
                  <Textarea
                    id="reason"
                    value={formData.reason}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                    rows={4}
                    placeholder={language === 'en' 
                      ? "Brief description of your health concern..." 
                      : "Maelezo mafupi ya hali yako ya afya..."}
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  size="lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? t.submitting : t.submit}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
