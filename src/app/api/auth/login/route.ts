
import { NextResponse, type NextRequest } from 'next/server';
import connectDB from '@/lib/mongodb';
import UserModel from '@/models/User';
import type { UserRole } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { username, password, role } = await req.json() as { username: string; password?: string; role: UserRole };

    if (!username || !role) {
      return NextResponse.json({ message: 'Username and role are required' }, { status: 400 });
    }
     if (!password) {
      return NextResponse.json({ message: 'Password is required' }, { status: 400 });
    }

    if (!['hew', 'officer'].includes(role)) {
      return NextResponse.json({ message: 'Invalid role' }, { status: 400 });
    }

    const user = await UserModel.findOne({ username });

    if (!user) {
      return NextResponse.json({ message: 'Invalid username or password' }, { status: 401 });
    }

    // If user exists but has no password (e.g. old account), they can't log in with password
    if (!user.password) {
        return NextResponse.json({ message: 'Account requires password setup. Please contact admin.' }, { status: 401 });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return NextResponse.json({ message: 'Invalid username or password' }, { status: 401 });
    }

    // Role check: Ensure the user is logging in with their assigned role
    // If the role provided in the login attempt doesn't match the stored role, deny login.
    // This prevents a user from switching roles just by selecting a different one on the login form.
    if (user.role !== role) {
        return NextResponse.json({ message: `Login failed. User is registered as ${user.role}, not ${role}.` }, { status: 403 });
    }
    
    const userData = {
        id: user._id.toString(),
        username: user.username,
        role: user.role,
    };

    return NextResponse.json({ user: userData }, { status: 200 });
  } catch (error) {
    console.error('Login API error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
