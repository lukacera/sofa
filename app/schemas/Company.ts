import { Schema, model } from 'mongoose';

const companySchema = new Schema({
  // Basic company info
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
  // Address info
  address: {
    street: String,
    city: String,
    country: String
  },

  // Events related
  createdEvents: [{
    type: Schema.Types.ObjectId,
    ref: 'Event'
  }]
}, {
  timestamps: true
});

companySchema.index({ email: 1 });
companySchema.index({ name: 1 });

const Company = model('Company', companySchema);

export default Company;