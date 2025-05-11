
"use client";
import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { UserPlus, Loader2, Eye, EyeOff } from 'lucide-react';
import type { UserRole } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

export function CreateUserForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<UserRole>('hew');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim() || !role) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in username, password, and select a role.',
        variant: 'destructive',
      });
      return;
    }
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, role }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to create user');
      }

      toast({
        title: 'User Created',
        description: `User ${username} (${role}) created successfully.`,
      });
      // Reset form
      setUsername('');
      setPassword('');
      setRole('hew');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Creation Failed',
        description: error.message || 'Could not create user. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full shadow-md mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <UserPlus /> Create New User
        </CardTitle>
        <CardDescription>
          Add a new Health Extension Worker (HEW) or Woreda Officer.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="new-username">Username</Label>
            <Input
              id="new-username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              required
              autoComplete="new-username"
            />
          </div>
          <div>
            <Label htmlFor="new-password">Password</Label>
            <div className="relative">
              <Input
                id="new-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
                autoComplete="new-password"
                className="pr-10"
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
          <div>
            <Label htmlFor="new-role">Role</Label>
            <Select value={role} onValueChange={(value) => setRole(value as UserRole)} required>
              <SelectTrigger id="new-role">
                <SelectValue placeholder="Select role..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hew">Health Worker (HEW)</SelectItem>
                <SelectItem value="officer">Woreda Officer</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UserPlus className="mr-2 h-4 w-4" />}
            Create User
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
