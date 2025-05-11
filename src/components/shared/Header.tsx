
"use client";
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, ShieldAlert, UserCog, Home } from 'lucide-react'; // ShieldAlert can be an app icon
import Link from 'next/link';

export function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-primary text-primary-foreground shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
          <ShieldAlert size={28} />
          <h1 className="text-xl font-semibold">Outbreak Sentinel</h1>
        </Link>
        
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="text-sm hidden sm:inline">Welcome, {user.username} ({user.role})</span>
              {user.role === 'officer' && (
                <Button variant="ghost" size="sm" asChild className="hover:bg-primary-foreground hover:text-primary">
                  <Link href="/admin/register-users">
                    <UserCog className="mr-1 h-4 w-4" /> Admin
                  </Link>
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={logout} className="hover:bg-primary-foreground hover:text-primary">
                <LogOut className="mr-1 h-4 w-4" /> Logout
              </Button>
            </>
          ) : (
             <Button variant="ghost" size="sm" asChild className="hover:bg-primary-foreground hover:text-primary">
                <Link href="/auth/login">
                  <LogIn className="mr-1 h-4 w-4" /> Login
                </Link>
              </Button>
          )}
           <Button variant="ghost" size="icon" asChild className="hover:bg-primary-foreground hover:text-primary sm:hidden">
              <Link href="/">
                <Home className="h-5 w-5" />
                <span className="sr-only">Home</span>
              </Link>
            </Button>
        </div>
      </div>
    </header>
  );
}
