
import { getEntry } from '@/lib/data';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Edit } from 'lucide-react';
import { format } from 'date-fns';
import { Separator } from '@/components/ui/separator';
import { DeleteEntryButton } from '@/components/DeleteEntryButton';
import { DecryptedContent } from '@/components/DecryptedContent';
import type { JournalEntry } from '@/lib/types';
import { ClientView } from './ClientView';

// This is now an async Server Component, which is the correct pattern.
export default async function EntryPage({ params }: { params: { id: string } }) {
  // We fetch the data on the server.
  // The 'user-placeholder' is used because server components don't have client-side auth context.
  // Firestore security rules will enforce ownership.
  const entry = await getEntry('user-placeholder', params.id);

  if (!entry) {
    notFound();
  }

  // We pass the server-fetched data as a prop to the Client Component.
  return <ClientView entry={entry} />;
}
