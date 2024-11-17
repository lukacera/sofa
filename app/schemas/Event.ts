import mongoose, { Schema } from 'mongoose';
import { EventType } from '../types/Event';

const EventSchema = new Schema<EventType>({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  aiAnalsis: {
    type: String,
    default: ''
  },
  date: {
    type: Date,
    required: true
  },
  location: {
    city: {
      type: String,
      required: true,
      trim: true
    }
  },
  capacity: {
    type: Number,
    required: true,
    min: 1,
    default: 100
  },
  tickets: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    benefits: [{
      type: String,
      required: true,
      trim: true
    }],
    total: {
      type: Number,
      required: true,
      min: 1
    },
    sold: {
      type: Number,
      required: true,
      default: 0
    },
    tags: [{
      type: String,
      required: true,
      trim: true
    }]
  }],
  organizer: {
    id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    }
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'cancelled'],
    default: 'draft'
  }
}, {
  timestamps: true 
});

EventSchema.index({ title: 1 });
EventSchema.index({ status: 1 });
EventSchema.index({ 'organizer.id': 1 });
EventSchema.index({ date: 1 });

export default mongoose.model<EventType>('Event', EventSchema);