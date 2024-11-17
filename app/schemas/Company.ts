import { Schema, model } from 'mongoose';
import { CompanyType} from '../types/Company';

const companySchema = new Schema<CompanyType>({
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
  location: {
    city: {
      type: String,
      required: true,
      trim: true
    }
  },
  // Events related
  createdEvents: [{
    type: Schema.Types.ObjectId,
    ref: 'Event',
    default: []
  }]
}, {
  timestamps: true
});

companySchema.index({ email: 1 });
companySchema.index({ name: 1 });

const Company = model<CompanyType>('Company', companySchema);

export default Company;