import { BookHeart } from 'lucide-react';

export function Logo() {
  return (
    <div className="flex items-center gap-2 text-primary-foreground">
      <BookHeart className="h-6 w-6" />
      <h1 className="text-xl font-bold font-headline">ReflectAI</h1>
    </div>
  );
}
