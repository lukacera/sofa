import mongoose, { Model, Schema } from 'mongoose';
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
  eventsAttending: {
    type: [{
      type: Schema.Types.ObjectId,
      ref: 'Event'
    }],
    default: []
  }
}, {
  timestamps: true // Adds createdAt and updatedAt automatically
});

// Index for faster queries when searching by email
userSchema.index({ email: 1 });

let User: Model<UserType>;
try {
  User = mongoose.model<UserType>('User');
} catch {
  User = mongoose.model<UserType>('User', userSchema);
}

export default User;