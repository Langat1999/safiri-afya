import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface PasswordChangeFormProps {
    passwordData: any;
    setPasswordData: (data: any) => void;
    onSubmit: () => void;
}

export const PasswordChangeForm = ({ passwordData, setPasswordData, onSubmit }: PasswordChangeFormProps) => {
    const { t } = useTranslation();

    return (
        <Card>
            <CardHeader>
                <CardTitle>{t('profile.changePassword')}</CardTitle>
                <CardDescription>{t('profile.passwordDescription')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="currentPassword">{t('profile.currentPassword')}</Label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                            id="currentPassword"
                            type="password"
                            className="pl-10"
                            value={passwordData.currentPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="newPassword">{t('profile.newPassword')}</Label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                            id="newPassword"
                            type="password"
                            className="pl-10"
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="confirmPassword">{t('profile.confirmPassword')}</Label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                            id="confirmPassword"
                            type="password"
                            className="pl-10"
                            value={passwordData.confirmPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                        />
                    </div>
                </div>

                <div className="pt-4">
                    <Button onClick={onSubmit} className="w-full md:w-auto">
                        <Lock className="w-4 h-4 mr-2" />
                        {t('profile.changePassword')}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};
