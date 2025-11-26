
import { useTranslation } from 'react-i18next';
import { Navbar } from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { User, Activity, Lock, Globe, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { useProfile } from '@/hooks/profile/useProfile';
import { usePasswordChange } from '@/hooks/profile/usePasswordChange';
import { ProfileForm } from '@/components/profile/ProfileForm';
import { ActivityStats } from '@/components/profile/ActivityStats';
import { PasswordChangeForm } from '@/components/profile/PasswordChangeForm';

const Profile = () => {
  const { t, i18n } = useTranslation();
  const { profile, formData, setFormData, isLoading, isSaving, updateProfile } = useProfile();
  const { passwordData, setPasswordData, changePassword } = usePasswordChange();

  const handleLanguageChange = (newLanguage: string) => {
    i18n.changeLanguage(newLanguage);
    toast.success(newLanguage === 'en' ? 'Language updated!' : 'Lugha imebadilishwa!');
  };

  const getProfileCompletion = () => {
    if (!profile) return 0;
    const fields = [profile.name, profile.phone, profile.dateOfBirth, profile.gender, profile.location];
    const filled = fields.filter(field => field && field.trim() !== '').length;
    return Math.round((filled / fields.length) * 100);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-[80vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container px-4 sm:px-6 lg:px-8 py-8 max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">{t('profile.title')}</h1>
          <p className="text-muted-foreground">{t('profile.subtitle')}</p>

          {/* Profile Completion */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">{t('profile.profileCompletion')}</span>
              <span className="text-sm font-medium">{getProfileCompletion()}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-primary rounded-full h-2 transition-all"
                style={{ width: `${getProfileCompletion()}%` }}
              />
            </div>
          </div>
        </div>

        <Tabs defaultValue="personal" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="personal">
              <User className="w-4 h-4 mr-2" />
              {t('profile.personalInfo')}
            </TabsTrigger>
            <TabsTrigger value="activity">
              <Activity className="w-4 h-4 mr-2" />
              {t('profile.activityStats')}
            </TabsTrigger>
            <TabsTrigger value="security">
              <Lock className="w-4 h-4 mr-2" />
              {t('profile.security')}
            </TabsTrigger>
          </TabsList>

          {/* Personal Information Tab */}
          <TabsContent value="personal" className="space-y-6">
            <ProfileForm
              formData={formData}
              setFormData={setFormData}
              onSubmit={updateProfile}
              isSaving={isSaving}
              email={profile?.email}
            />

            {/* Settings */}
            <Card>
              <CardHeader>
                <CardTitle>{t('profile.settings')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="language">{t('profile.language')}</Label>
                  <Select value={i18n.language} onValueChange={handleLanguageChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">
                        <div className="flex items-center">
                          <Globe className="w-4 h-4 mr-2" />
                          {t('profile.english')}
                        </div>
                      </SelectItem>
                      <SelectItem value="sw">
                        <div className="flex items-center">
                          <Globe className="w-4 h-4 mr-2" />
                          {t('profile.swahili')}
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Activity Stats Tab */}
          <TabsContent value="activity" className="space-y-6">
            {profile && (
              <ActivityStats
                stats={profile.stats}
                createdAt={profile.createdAt}
                lastLogin={profile.lastLogin}
              />
            )}
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <PasswordChangeForm
              passwordData={passwordData}
              setPasswordData={setPasswordData}
              onSubmit={changePassword}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
