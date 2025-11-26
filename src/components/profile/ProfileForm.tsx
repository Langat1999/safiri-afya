import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Mail, Phone, Calendar, MapPin, Save, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ProfileFormProps {
    formData: any;
    setFormData: (data: any) => void;
    onSubmit: () => void;
    isSaving: boolean;
    email?: string;
}

export const ProfileForm = ({ formData, setFormData, onSubmit, isSaving, email }: ProfileFormProps) => {
    const { t } = useTranslation();

    return (
        <Card>
            <CardHeader>
                <CardTitle>{t('profile.personalInfo')}</CardTitle>
                <CardDescription>{t('profile.description')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">{t('profile.name')}</Label>
                        <div className="relative">
                            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="name"
                                className="pl-10"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">{t('profile.email')}</Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input id="email" className="pl-10" value={email} disabled />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="phone">{t('profile.phone')}</Label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="phone"
                                className="pl-10"
                                placeholder="+254..."
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="dateOfBirth">{t('profile.dateOfBirth')}</Label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="dateOfBirth"
                                type="date"
                                className="pl-10"
                                value={formData.dateOfBirth}
                                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="gender">{t('profile.gender')}</Label>
                        <Select value={formData.gender} onValueChange={(value) => setFormData({ ...formData, gender: value })}>
                            <SelectTrigger>
                                <SelectValue placeholder={t('profile.selectGender')} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="male">{t('profile.male')}</SelectItem>
                                <SelectItem value="female">{t('profile.female')}</SelectItem>
                                <SelectItem value="other">{t('profile.other')}</SelectItem>
                                <SelectItem value="prefer-not-to-say">{t('profile.preferNotToSay')}</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="location">{t('profile.location')}</Label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="location"
                                className="pl-10"
                                placeholder="Nairobi"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                <div className="pt-4">
                    <Button onClick={onSubmit} disabled={isSaving} className="w-full md:w-auto">
                        {isSaving ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                {t('profile.saving')}
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4 mr-2" />
                                {t('profile.saveChanges')}
                            </>
                        )}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};
