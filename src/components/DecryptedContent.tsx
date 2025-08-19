'use client';

import { useEffect, useState } from 'react';
import { useSession } from './SessionProvider';
import { decryptContent } from '@/lib/crypto';
import { Loader2 } from 'lucide-react';

interface DecryptedContentProps {
  content: string;
}

export function DecryptedContent({ content }: DecryptedContentProps) {
  const { user } = useSession();
  const [decryptedText, setDecryptedText] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function decrypt() {
      if (user && content) {
        try {
          const text = await decryptContent(content, user.uid);
          setDecryptedText(text);
        } catch (error) {
          console.error('Failed to decrypt content:', error);
          setDecryptedText('Could not decrypt this entry.');
        } finally {
            setIsLoading(false);
        }
      }
    }
    decrypt();
  }, [content, user]);

  if(isLoading) {
    return <Loader2 className="animate-spin" />;
  }

  return <p className="whitespace-pre-wrap text-base">{decryptedText}</p>;
}
