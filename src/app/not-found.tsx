import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FileQuestion } from "lucide-react";
import { Logo } from "@/components/Logo";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center text-center p-4">
      <div className="mb-8">
        <Logo />
      </div>
      <FileQuestion className="w-24 h-24 text-primary mb-4" />
      <h2 className="text-3xl font-bold font-headline mb-2">
        404 - Page Not Found
      </h2>
      <p className="text-muted-foreground mb-6 max-w-sm">
        The page you are looking for does not exist. It might have been moved or
        deleted.
      </p>
      <Button asChild>
        <Link href="/">Return to Dashboard</Link>
      </Button>
    </div>
  );
}
