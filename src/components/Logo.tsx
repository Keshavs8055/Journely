import { PenLine } from 'lucide-react';

export function Logo() {
  return (
    <div className="flex items-center gap-2">
      <PenLine className="h-6 w-6 text-primary-foreground/80" />
      <h1 className="text-xl font-bold font-headline text-primary-foreground">ReflectAI</h1>
    </div>
  );
}
