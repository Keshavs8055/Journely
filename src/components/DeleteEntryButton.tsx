'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
import { deleteEntry } from '@/lib/data';
import { useSession } from './SessionProvider';
import { useToast } from '@/hooks/use-toast';

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
        title: "Authentication Error",
        description: "You must be logged in to delete an entry.",
        variant: "destructive",
      });
      return;
    }
    
    setIsDeleting(true);
    
    try {
      await deleteEntry(user.uid, id);
      toast({
        title: "Success",
        description: "Your journal entry has been deleted.",
      });
      router.push('/');
      router.refresh(); // Refresh dashboard
    } catch (error) {
      console.error("Failed to delete entry:", error);
      toast({
        title: "Deletion Error",
        description: "Failed to delete the entry. Please try again.",
        variant: "destructive",
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
