'use client';

import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { LogOut } from 'lucide-react';
import { useSession } from './SessionProvider';

export function SignOutButton() {
  const router = useRouter();
  const { user } = useSession();

  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/sign-in');
  };

  return (
    <div className="p-4 mt-auto border-t">
        <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                {user?.email?.charAt(0).toUpperCase()}
            </div>
            <p className="text-sm font-medium truncate">{user?.email}</p>
        </div>
      <Button variant="ghost" className="w-full justify-start gap-2" onClick={handleSignOut}>
        <LogOut size={20} />
        <span>Sign Out</span>
      </Button>
    </div>
  );
}
