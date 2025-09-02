"use client";

import { AppSidebar } from "@/components/AppSidebar";
import { useSession } from "@/components/SessionProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2, Menu, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Link from "next/link";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/sign-in");
    }
  }, [isLoading, user, router]);

  if (isLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <aside className="hidden md:block md:w-64 bg-card border-r">
        <AppSidebar />
      </aside>
      <div className="flex flex-col flex-1">
        <header className="md:hidden flex items-center justify-between p-4 border-b">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
              >
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="p-0 w-64"
            >
              <AppSidebar />
            </SheetContent>
          </Sheet>
          <Button asChild>
            <Link
              className="flex items-center gap-2"
              href="/new-entry"
            >
              <PlusCircle className="h-6 w-6" />
              <span>New Journal Entry</span>
              <span className="sr-only">New Journal Entry</span>
            </Link>
          </Button>
        </header>
        <main className="flex-1 p-4 md:p-8 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
