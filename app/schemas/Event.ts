import mongoose, { model, Schema } from 'mongoose';
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
  aiAnalysis: {
    type: String,
    default: ''
  },
  date: {
    type: Date,
    required: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  capacity: {
    type: Number,
    required: true,
    min: 1,
    default: 100
  },
  tickets: {
    type: [{
      name: {
        type: String,
        required: true,
        enum: ['free', 'paid'],
        default: 'free'
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
    }],
    default: [] 
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
    default: 'https://res.cloudinary.com/dluypaeie/image/upload/v1732538732/Avatars_Circles_Glyph_Style_nrein3.jpg'
  },
  attendees: {
    type: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }],
    default: []
  }
}, {
  timestamps: true 
});

EventSchema.index({ title: 1 });
EventSchema.index({ status: 1 });
EventSchema.index({ 'organizer.id': 1 });
EventSchema.index({ date: 1 });

const Event = mongoose.models.Event || model<EventType>('Event', EventSchema);

export default Event;