
"use client";
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, ShieldAlert } from 'lucide-react'; // ShieldAlert can be an app icon

export function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-primary text-primary-foreground shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <ShieldAlert size={28} />
          <h1 className="text-xl font-semibold">Outbreak Sentinel</h1>
        </div>
        {user && (
          <div className="flex items-center gap-3">
            <span className="text-sm hidden sm:inline">Welcome, {user.username} ({user.role})</span>
            <Button variant="ghost" size="sm" onClick={logout} className="hover:bg-primary-foreground hover:text-primary">
              <LogOut className="mr-1 h-4 w-4" /> Logout
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
