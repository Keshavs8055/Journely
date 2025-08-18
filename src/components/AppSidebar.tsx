import Link from 'next/link';
import { LayoutDashboard, Settings, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/Logo';
import { SignOutButton } from './SignOutButton';

export function AppSidebar() {
  return (
    <div className="flex flex-col h-full bg-card border-r">
      <div className="p-4 border-b">
        <Logo />
      </div>
      <nav className="flex-1 p-4 space-y-2">
        <Button variant="ghost" className="w-full justify-start gap-2" asChild>
          <Link href="/">
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </Link>
        </Button>
        <Button variant="ghost" className="w-full justify-start gap-2" asChild>
          <Link href="/settings">
            <Settings size={20} />
            <span>Settings</span>
          </Link>
        </Button>
      </nav>
      <div className="p-4 border-t">
        <Button className="w-full gap-2" asChild>
          <Link href="/new-entry">
            <PlusCircle size={20} />
            New Entry
          </Link>
        </Button>
      </div>
      <SignOutButton />
    </div>
  );
}
