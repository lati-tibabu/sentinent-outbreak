
import { AnonymousReportForm } from '@/components/anonymous/AnonymousReportForm';
import { Header } from '@/components/shared/Header'; // Re-use header if needed, or a simpler one
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function AnonymousReportPage() {
  return (
    <div className="flex flex-col min-h-screen bg-secondary/20">
      {/* A simplified header or no header could be used if preferred for anonymity */}
      <header className="bg-primary text-primary-foreground shadow-md">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
            <h1 className="text-xl font-semibold">Outbreak Sentinel - Anonymous Report</h1>
            <Button variant="ghost" asChild className="hover:bg-primary-foreground hover:text-primary">
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Login
              </Link>
            </Button>
        </div>
      </header>
      <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
        <AnonymousReportForm />
      </main>
      <footer className="text-center py-4 text-sm text-muted-foreground">
        Your privacy is important. Reports submitted here are anonymous.
      </footer>
    </div>
  );
}
