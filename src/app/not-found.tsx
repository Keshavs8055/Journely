import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { FileQuestion } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center text-center">
        <FileQuestion className="w-24 h-24 text-primary mb-4" />
      <h2 className="text-3xl font-bold font-headline mb-2">Page Not Found</h2>
      <p className="text-muted-foreground mb-6">
        The page you are looking for does not exist.
      </p>
      <Button asChild>
        <Link href="/">Return to Dashboard</Link>
      </Button>
    </div>
  )
}
