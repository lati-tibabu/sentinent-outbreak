
import { CreateUserForm } from '@/components/admin/CreateUserForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft, UserCog } from 'lucide-react';
import Link from 'next/link';

export default function AdminRegisterUsersPage() {
  return (
    <div className="flex flex-col min-h-screen bg-muted/20">
      <header className="bg-primary text-primary-foreground shadow-md">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <UserCog size={28} />
            <h1 className="text-xl font-semibold">Admin - User Registration</h1>
          </div>
          <Button variant="ghost" asChild className="hover:bg-primary-foreground hover:text-primary">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Login
            </Link>
          </Button>
        </div>
      </header>
      <main className="flex-grow container mx-auto px-4 py-8 flex flex-col items-center">
        <div className="w-full max-w-md">
          <p className="text-center text-muted-foreground mb-6">
            This page is for administrative user creation (HEW or Officer). For prototyping purposes, it is accessible without login.
          </p>
          <CreateUserForm />
        </div>
      </main>
      <footer className="text-center py-4 text-sm text-muted-foreground">
        Outbreak Sentinel - Admin Panel
      </footer>
    </div>
  );
}
