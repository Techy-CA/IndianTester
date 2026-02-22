import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name:      string;
  email:     string;
  password:  string;
  whatsapp:  string;
  upiId?:    string;
  role:      'superadmin' | 'admin' | 'buyer';
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  name: {
    type:     String,
    required: true,
    trim:     true,
  },
  email: {
    type:      String,
    required:  true,
    unique:    true,
    lowercase: true,
    trim:      true,
  },
  password: {
    type:     String,
    required: true,
  },
  whatsapp: {
    type:     String,
    required: true,
    trim:     true,
  },
  upiId: {
    type:    String,
    default: '',
    trim:    true,
  },
  role: {
    type:    String,
    enum:    ['superadmin', 'admin', 'buyer'],
    default: 'buyer',
  },
}, { timestamps: true });

export default mongoose.model<IUser>('User', UserSchema);
