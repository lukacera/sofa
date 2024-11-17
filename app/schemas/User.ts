import mongoose, { Schema, model } from 'mongoose';
import { UserType } from '../types/User';
const userSchema = new Schema<UserType>({
  // Basic user info
  name: { 
    type: String, 
    required: true,
    trim: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true
  },
  password: { 
    type: String, 
    required: true 
  },
  // Event participation
  eventsAttending: [{
    type: Schema.Types.ObjectId,
    ref: 'Event'
  }]
}, {
  timestamps: true // Adds createdAt and updatedAt automatically
});

// Index for faster queries when searching by email
userSchema.index({ email: 1 });

const User = mongoose.models.User || model<UserType>('User', userSchema);

export default User;