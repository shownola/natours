const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A name is required'],
    unique: true
  },
  rating: {
    type: Number,
    default: 4.5
  },
  price: {
    type: Number,
    required: [true, 'Must include price']
  }
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
