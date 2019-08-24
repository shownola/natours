const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A name is required'],
    unique: true,
    trim: true,
    maxLength: [40, 'Must be 40 characters or less'],
    minLength: [3, 'Must be at least 3 characters'],
    // validate: [validator.isAlpha, 'Tour name must only contain characters']
  },
  slug: String,
  duration: {
    type: Number,
    required: [true, 'A tour must have a duration']
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'A tour must have a group size']
  },
  difficulty: {
    type: String,
    required: [true, 'A tour must include difficulty'],
    enum: {
      values: ['easy', 'medium', 'difficult'],
      message: 'Difficulty is either, easy, medium or difficult'
    }
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
    min: [1, 'Rating must be greater than 1'],
    max: [5, 'Rating must be less than or equal to 5']
  },
  ratingsQuantity: {
    type: Number,
    default: 0
  },
  price: {
    type: Number,
    required: [true, 'Must include price']
  },
  priceDiscount: {
    type: Number,
    validate: {
      validator: function(val){
        return val < this.price;
        // 'this' only points to current doc on NEW document creation
      },
      message: 'Discount price ({VALUE}) should be less than regular price.'
    }

  },
  summary: {
    type: String,
    trim: true,
    required: [true, 'Must include a description']
  },
  description: {
    type: String,
    trim: true
  },
  imageCover: {
    type: String,
    required: [true, 'Must have a cover image']
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false
  },
  startDates: [Date],
  secretTour: {
    type: Boolean,
    default: false
  }
},
{
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

tourSchema.virtual('durationWeeks').get(function() {
  return this.duration / 7;
});
// DOCUMENT MIDDLEWARE runs before .save() and .create()
tourSchema.pre('save', function(next) {
  this.slug = slugify(this.name, {lower: true});
  next();
});

// tourSchema.pre('save', function(next){
//   console.log('Will save document...');
//   next();
// });
//
// tourSchema.post('save', function(doc, next){
//   console.log(doc);
//   next();
// });

// QUERY MIDDLEWARE
tourSchema.pre(/^find/, function(next){
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});

tourSchema.post(/^find/, function(docs, next){
  console.log(`Query took ${Date.now() - this.start} milliseconds`);
  next();
});

// AGGREGATE MIDDLEWARE

tourSchema.pre('aggregate', function(next){
  this.pipeline().unshift({ $match: { secretTour: {$ne: true} } });
  next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
