import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ActivityStatsProps {
    stats: {
        totalAppointments: number;
        totalSymptomChecks: number;
        totalBookings: number;
        accountAge: number;
    };
    createdAt: string;
    lastLogin: string | null;
}

export const ActivityStats = ({ stats, createdAt, lastLogin }: ActivityStatsProps) => {
    const { t } = useTranslation();

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">{t('profile.totalAppointments')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalAppointments}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">{t('profile.totalSymptomChecks')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalSymptomChecks}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">{t('profile.totalBookings')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalBookings}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">{t('profile.accountAge')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {stats.accountAge} {t('profile.days')}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>{t('profile.accountInfo')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">{t('profile.accountCreated')}</span>
                        <span className="font-medium">{createdAt ? new Date(createdAt).toLocaleDateString() : '-'}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">{t('profile.lastLogin')}</span>
                        <span className="font-medium">
                            {lastLogin ? new Date(lastLogin).toLocaleString() : t('profile.never')}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">{t('profile.accountStatus')}</span>
                        <Badge variant="default">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            {t('profile.active')}
                        </Badge>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
