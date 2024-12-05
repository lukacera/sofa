import mongoose, { model, Schema } from 'mongoose';
import { Category } from '../types/Category';

export const CategorySchema = new Schema<Category>({
    
}, {
  timestamps: true 
});

EventSchema.index({ title: 1 });
EventSchema.index({ status: 1 });
EventSchema.index({ 'organizer.id': 1 });
EventSchema.index({ date: 1 });

const Event = mongoose.models.Event || model<EventType>('Event', EventSchema);

export default Event;