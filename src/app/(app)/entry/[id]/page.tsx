'use client';

import { useEffect, useState } from 'react';
import { useParams, notFound } from 'next/navigation';
import { Loader2 } from 'lucide-react';

import { getEntry } from '@/lib/data';
import type { JournalEntry } from '@/lib/types';
import { useSession } from '@/components/SessionProvider';
import { ClientView } from './ClientView';

export default function EntryPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const { user, isLoading: isSessionLoading } = useSession();
  const [entry, setEntry] = useState<JournalEntry | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!user || !id) {
      // Don't fetch until we have a user and an ID.
      return;
    }

    const fetchEntry = async () => {
      try {
        setIsLoading(true);
        const fetchedEntry = await getEntry(user.uid, id);
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
  }, [user, id]);

  if (isSessionLoading || isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !entry) {
    notFound();
  }

  return <ClientView entry={entry} />;
}
