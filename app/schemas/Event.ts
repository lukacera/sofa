import mongoose, { model, Schema } from 'mongoose';
import { EventType } from '../types/Event';

export const EventSchema = new Schema<EventType>({
  title: {
    type: String,
    trim: true,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  aiAnalysis: {
    type: String,
    default: ''
  },
  date: {
    type: Date,
    default: () => {
      const now = new Date();
      now.setMonth(now.getMonth() + 1);
      return now;
    }
  },
  location: {
    type: {
      city: { type: String, trim: true },
      address: { type: String, trim: true },
      country: { type: String, trim: true }
    },
    default: {
      city: 'Unknown',
      address: 'Unknown',
      country: 'Unknown'
    }
  },
  capacity: {
    type: Number,
    min: 1,
    default: 100
  },
  tags: {
    type: [{
      type: String,
      trim: true
    }],
    default: []
  },
  organizer: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User'
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'cancelled', 'finished'],
    default: 'draft'
  },
  type: {
    type: String,
    enum: ['conference', 'workshop', 'meetup', 'seminar', 'other'],
    default: 'other'
  },
  image: {
    type: String,
    default: 'https://res.cloudinary.com/dluypaeie/image/upload/v1733921999/kane-reinholdtsen-LETdkk7wHQk-unsplash_htixoq.jpg'
  },
  attendees: {
    type: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }],
    default: []
  },
  timezone: {
    type: String,
    default: 'Europe/Berlin'
  }
}, {
  timestamps: true 
});

EventSchema.index({ title: 1 });
EventSchema.index({ 'organizer.id': 1 });
EventSchema.index({ date: 1 });

const Event = mongoose.models.Event || model<EventType>('Event', EventSchema);

export default Event;