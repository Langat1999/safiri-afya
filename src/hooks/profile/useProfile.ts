import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { profileAPI } from '@/services/api';
import { toast } from 'sonner';

export interface UserProfile {
    id: string;
    email: string;
    name: string;
    phone: string;
    dateOfBirth: string;
    gender: string;
    location: string;
    profilePicture: string;
    role: string;
    createdAt: string;
    lastLogin: string | null;
    stats: {
        totalAppointments: number;
        totalSymptomChecks: number;
        totalBookings: number;
        accountAge: number;
    };
}

export const useProfile = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        dateOfBirth: '',
        gender: '',
        location: '',
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            if (!isAuthenticated) {
                navigate('/login');
                return;
            }

            const data = await profileAPI.get();
            setProfile(data);
            setFormData({
                name: data.name || '',
                phone: data.phone || '',
                dateOfBirth: data.dateOfBirth || '',
                gender: data.gender || '',
                location: data.location || '',
            });
        } catch (error) {
            console.error('Error fetching profile:', error);
            toast.error('Failed to load profile');
            navigate('/login');
        } finally {
            setIsLoading(false);
        }
    };

    const updateProfile = async () => {
        setIsSaving(true);
        try {
            await profileAPI.update(formData);
            toast.success('Profile updated successfully!');
            fetchProfile();
            return true;
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error(error instanceof Error ? error.message : 'Failed to update profile');
            return false;
        } finally {
            setIsSaving(false);
        }
    };

    return {
        profile,
        formData,
        setFormData,
        isLoading,
        isSaving,
        updateProfile,
    };
};
