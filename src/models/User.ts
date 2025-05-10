
import mongoose, { Schema, Document, models, Model } from 'mongoose';
import type { UserRole } from '@/lib/types';

export interface IUser extends Document {
  username: string;
  role: UserRole;
  password?: string; // Optional for now, but good for future
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    role: {
      type: String,
      required: true,
      enum: ['hew', 'officer'],
    },
    password: {
      type: String,
      required: false, // Not required for initial username-only login
    },
  },
  { timestamps: true }
);

// Avoid recompiling the model if it already exists
const UserModel: Model<IUser> = models.User || mongoose.model<IUser>('User', UserSchema);

export default UserModel;
