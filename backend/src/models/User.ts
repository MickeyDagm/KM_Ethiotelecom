import mongoose, { Document, Schema } from 'mongoose';

export enum UserRole {
  Expert = 'Expert',
  AdvancedSupport = 'AdvancedSupport',
  InternationalGateway = 'InternationalGateway',
  RegionalTechnician = 'RegionalTechnician',
  Admin = 'Admin',
}

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  department?: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.RegionalTechnician,
      required: true,
    },
    department: { type: String },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IUser>('User', userSchema);
