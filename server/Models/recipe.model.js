import mongoose from 'mongoose';

const recipeSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: 'Title is required'
  },
  ingredients: {
    type: String,
    trim: true,
    required: 'At least one ingredient is required'
  },
  instructions: {
    type: String,
    trim: true,
    required: 'Instructions are required'
  },
  creator: {
    type: String,
  },
  preptime: {
    type: Number,
  },
  cooktime: {
    type: Number,
  },
  servings: {
    type: Number,
  },
  image: {
    data: Buffer,
    contentType: String,
  },
  created: {
    type: Date,
    default: Date.now
  },
  updated: {
    type: Date,
    default: Date.now
  }
});

recipeSchema.pre('save', function(next) {
  this.updated = new Date();
  next();
});

export default mongoose.model('Recipe', recipeSchema);