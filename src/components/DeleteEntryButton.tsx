'use client';

import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Trash2, Loader2 } from 'lucide-react';
import { deleteJournalEntry } from '@/lib/actions';
import { useSession } from './SessionProvider';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

interface DeleteEntryButtonProps {
  id: string;
}

export function DeleteEntryButton({ id }: DeleteEntryButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const { user } = useSession();
  const { toast } = useToast();
  const router = useRouter();

  const handleDelete = async () => {
    if (!user) {
        toast({
            title: "Error",
            description: "You must be logged in to delete an entry.",
            variant: "destructive"
        });
        return;
    }
    setIsDeleting(true);
    try {
      const result = await deleteJournalEntry(id, user.uid);
      if (result.success) {
        toast({
            title: "Success",
            description: "Your journal entry has been deleted.",
        });
        router.push('/');
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete the entry. Please try again.",
        variant: "destructive"
    });
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">
          <Trash2 size={16} className="mr-2" />
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            journal entry.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={isDeleting} className="bg-destructive hover:bg-destructive/90">
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              'Continue'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
