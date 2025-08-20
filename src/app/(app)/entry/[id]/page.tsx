
'use client';

import { useEffect, useState } from 'react';
import { notFound } from 'next/navigation';
import { Loader2 } from 'lucide-react';

import { getEntry } from '@/lib/data';
import type { JournalEntry } from '@/lib/types';
import { useSession } from '@/components/SessionProvider';
import { ClientView } from './ClientView';

// This is now a pure Client Component to reliably handle authentication and data fetching.
export default function EntryPage({ params }: { params: { id: string } }) {
  const { user, isLoading: isSessionLoading } = useSession();
  const [entry, setEntry] = useState<JournalEntry | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Don't fetch until we have a user session.
    if (!user) {
      return;
    }

    const fetchEntry = async () => {
      try {
        setIsLoading(true);
        const fetchedEntry = await getEntry(user.uid, params.id);
        if (fetchedEntry) {
          setEntry(fetchedEntry);
        } else {
          setError(true);
        }
      } catch (e) {
        console.error("Failed to fetch entry:", e);
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEntry();
  }, [user, params.id]);

  // Handle various loading and error states.
  if (isSessionLoading || isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !entry) {
    // If there was an error or the entry is null after loading, show not found.
    notFound();
  }

  // Once data is successfully loaded, render the client view with it.
  return <ClientView entry={entry} />;
}
