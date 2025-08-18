import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

export function Header() {
  return (
    <header className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold font-headline">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, let's capture your thoughts.</p>
      </div>
      <Button asChild className="md:hidden">
        <Link href="/new-entry">
          <PlusCircle className="mr-2 h-4 w-4" /> New Entry
        </Link>
      </Button>
    </header>
  );
}
