
import { getEntry } from '@/lib/data';
import { notFound } from 'next/navigation';
import { ClientView } from './ClientView';

// This is an async Server Component.
// Its only job is to fetch data and pass it to the client component.
export default async function EntryPage({ params }: { params: { id: string } }) {
  // The 'user-placeholder' is used because server components don't have client-side auth context.
  // Firestore security rules are essential for enforcing data ownership.
  const entry = await getEntry('user-placeholder', params.id);

  if (!entry) {
    notFound();
  }

  // Pass the server-fetched data as a prop to the Client Component for rendering.
  return <ClientView entry={entry} />;
}
