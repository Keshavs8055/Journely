import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';

export default function SettingsPage() {
  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold font-headline">Settings</h1>
        <p className="text-muted-foreground">Manage your account and notification settings.</p>
      </div>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Notifications</CardTitle>
          <CardDescription>
            Configure how you receive reminders and updates.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between space-x-4 rounded-md border p-4">
            <div className="flex flex-col">
              <Label htmlFor="push-notifications" className="font-medium">
                Daily Reminders
              </Label>
              <p className="text-sm text-muted-foreground">
                Receive a push notification each day to remind you to write.
              </p>
            </div>
            <Switch id="push-notifications" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
