import Link from 'next/link';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full text-center space-y-6 bg-card border border-border p-8 rounded-2xl shadow-xl">
        <div className="h-20 w-20 bg-red-100 text-red-600 rounded-3xl mx-auto flex items-center justify-center shadow-inner">
          <ShieldAlert className="h-10 w-10" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-2xl font-bold font-heading text-foreground">Access Restricted</h1>
          <p className="text-sm text-muted-foreground">
            You do not have permission to view this section with your current account role.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button asChild variant="outline" className="w-full">
            <Link href="/" className="flex items-center justify-center gap-2">
              <Home className="h-4 w-4" /> Go to Home
            </Link>
          </Button>
          <Button asChild className="w-full">
            <Link href="/login" className="flex items-center justify-center gap-2">
              <ArrowLeft className="h-4 w-4" /> Switch Account
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
