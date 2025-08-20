'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';

export default function SettingsPage() {
  const { toast } = useToast();
  const [notificationPermission, setNotificationPermission] = useState('default');

  useEffect(() => {
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  const handleNotificationsToggle = async (checked: boolean) => {
    if (!('Notification' in window)) {
      toast({
        title: "Unsupported Browser",
        description: "This browser does not support desktop notifications.",
        variant: "destructive",
      });
      return;
    }

    if (checked) {
      if (notificationPermission === 'granted') {
        toast({
            title: "Notifications are already enabled.",
        });
      } else if (notificationPermission !== 'denied') {
        const permission = await Notification.requestPermission();
        setNotificationPermission(permission);
        if (permission === 'granted') {
          toast({
            title: "Success!",
            description: "You will now receive daily reminders.",
          });
          // In a real app, you would send the subscription to your server here
        } else {
            toast({
                title: "Notifications Blocked",
                description: "You have blocked notifications. To enable them, please update your browser settings.",
                variant: "destructive"
            });
        }
      } else {
        toast({
            title: "Notifications Blocked",
            description: "You have blocked notifications. To enable them, please update your browser settings.",
            variant: "destructive"
        });
      }
    } else {
      // Logic to unsubscribe user on the server would go here
      toast({
        title: "Notifications Disabled",
        description: "You will no longer receive daily reminders.",
      });
    }
  };

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
            <Switch 
              id="push-notifications" 
              onCheckedChange={handleNotificationsToggle}
              checked={notificationPermission === 'granted'}
              aria-label="Toggle daily reminders"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
