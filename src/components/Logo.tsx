import { BookHeart } from 'lucide-react';

export function Logo() {
  return (
    <div className="flex items-center gap-2 text-primary-foreground">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-7 w-7 text-primary"
      >
        <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
        <path d="M13.4 12.6a2.1 2.1 0 0 0 2.5 2.5 2.1 2.1 0 0 0 2.5-2.5 2.1 2.1 0 0 0-2.5-2.5 2.1 2.1 0 0 0-2.5 2.5Z" />
      </svg>
      <h1 className="text-xl font-bold font-headline text-foreground">ReflectAI</h1>
    </div>
  );
}
