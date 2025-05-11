
"use client";
import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { UserRole } from '@/lib/types';
import { LogIn, ShieldQuestion, Eye, EyeOff, Home } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<UserRole>('hew');
  const { login, isLoading } = useAuth();
  const { toast } = useToast();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (username.trim() === '') {
      toast({ variant: 'destructive', title: 'Validation Error', description: 'Please enter a username.' });
      return;
    }
    if (password.trim() === '') {
      toast({ variant: 'destructive', title: 'Validation Error', description: 'Please enter a password.' });
      return;
    }
    login(username, password, role);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary via-secondary to-background p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
             <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></svg>
          </div>
          <CardTitle className="text-3xl font-bold">Outbreak Sentinel</CardTitle>
          <CardDescription>Disease Reporting & Monitoring</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="e.g., hew_user or officer_jane"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="text-base"
                autoComplete="username"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="text-base pr-10"
                  autoComplete="current-password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7 px-2"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <RadioGroup
                value={role}
                onValueChange={(value: string) => setRole(value as UserRole)}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="hew" id="role-hew" />
                  <Label htmlFor="role-hew">Health Worker (HEW)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="officer" id="role-officer" />
                  <Label htmlFor="role-officer">Woreda Officer</Label>
                </div>
              </RadioGroup>
            </div>
            <Button type="submit" className="w-full text-lg py-3" disabled={isLoading}>
              <LogIn className="mr-2 h-5 w-5" /> {isLoading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
          <div className="mt-6 space-y-3 text-center">
            <Link href="/report/anonymous" className="text-sm text-primary hover:underline inline-flex items-center gap-1.5">
              <ShieldQuestion size={16} />
              Submit an Anonymous Community Report
            </Link>
            <div>
              <Button variant="outline" asChild size="sm">
                <Link href="/">
                  <Home className="mr-2 h-4 w-4" />
                  Back to Home
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

