import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: 'Name is required'
  },
  email: {
    type: String,
    trim: true,
    unique: 'Email already exists',
    match: [/.+\@.+\..+/, 'Please fill a valid email address'],
    required: 'Email is required'
  },
  message: {
    type: [String],
    required: 'Message is required'
  },
  created: {
    type: Date,
    default: Date.now
  }  
});
export default mongoose.model('Contact', contactSchema);