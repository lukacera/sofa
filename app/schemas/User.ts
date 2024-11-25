import mongoose, { Model, Schema } from 'mongoose';
import { UserType } from '../types/User';
const userSchema = new Schema<UserType>({
  type: {
    type: String,
    required: true,
    enum: ['individual', 'company'],
    default: 'individual'
  },
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
  image: { 
    type: String, 
    required: false,
    default: "https://res.cloudinary.com/dluypaeie/image/upload/v1732538732/Avatars_Circles_Glyph_Style_nrein3.jpg" 
  },
  eventsAttending: {
    type: [{
      type: Schema.Types.ObjectId,
      ref: 'Event'
    }],
    default: []
  },
  events: {
    type: [{
      type: Schema.Types.ObjectId,
      ref: 'Event'
    }],
    default: []
  },
  description: {
    type: String,
    required: false,
    default: null
  },
  location: {
    type: String,
    required: false,
    default: null
  },
  password: {
    type: String,
    required: true
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