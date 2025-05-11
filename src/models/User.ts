
import mongoose, { Schema, Document, models, Model } from 'mongoose';
import bcrypt from 'bcryptjs';
import type { UserRole } from '@/lib/types';

const SALT_WORK_FACTOR = 10;

export interface IUser extends Document {
  username: string;
  role: UserRole;
  password?: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    role: {
      type: String,
      required: true,
      enum: ['hew', 'officer'],
    },
    password: {
      type: String,
      required: false, 
    },
  },
  { timestamps: true }
);

UserSchema.pre('save', async function (next) {
  const user = this as IUser;

  if (!user.isModified('password') || !user.password) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
    user.password = await bcrypt.hash(user.password, salt);
    next();
  } catch (err: any) {
    console.error('Bcrypt error during pre-save hook for user:', user.username, err); // More specific logging
    next(err); // Propagate the error so it can be caught by the route handler
  }
});

UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  const user = this as IUser;
  if (!user.password) {
    return false; 
  }
  return bcrypt.compare(candidatePassword, user.password);
};

const UserModel: Model<IUser> = models.User || mongoose.model<IUser>('User', UserSchema);

export default UserModel;
