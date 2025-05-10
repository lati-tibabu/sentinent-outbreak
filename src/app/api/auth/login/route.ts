
import { NextResponse, type NextRequest } from 'next/server';
import connectDB from '@/lib/mongodb';
import UserModel from '@/models/User';
import type { UserRole } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { username, role } = await req.json() as { username: string; role: UserRole };

    if (!username || !role) {
      return NextResponse.json({ message: 'Username and role are required' }, { status: 400 });
    }

    if (!['hew', 'officer'].includes(role)) {
      return NextResponse.json({ message: 'Invalid role' }, { status: 400 });
    }

    let user = await UserModel.findOne({ username });

    if (user) {
      // User exists, check if role matches. If not, update role.
      // For simplicity in "username-only login", we can allow role change on login.
      // In a real app with passwords, this logic might be different.
      if (user.role !== role) {
        user.role = role;
        await user.save();
      }
    } else {
      // User does not exist, create a new one
      // In a real app, you'd likely want password setup here or pre-provisioned users.
      user = new UserModel({ username, role });
      await user.save();
    }
    
    // Return user data (excluding password if it were present)
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
