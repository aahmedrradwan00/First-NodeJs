const mongoose = require('mongoose');
const slugify = require('slugify');
const User = require('./userModel');

// import validator from 'validator';

const validator = require('validator');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'a tour must have a name'],
      unique: true,
      trim: true,
      maxlength: [40, 'A tour name must have less or equal then 40 characters'],
      minlength: [10, 'A tour name must have more or equal then 10 characters'],
      // validate: [validator.isAlpha, 'Tour name must only contain characters'],
    },
    duration: {
      type: Number,
      required: [true, 'a tour must have a duration'],
    },
    slug: String,
    maxGroupSize: {
      type: Number,
      required: [true, 'a tour must have a maxGroupSize'],
    },
    difficulty: {
      type: String,
      required: [true, 'a tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either: easy, medium, difficult',
      },
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'a tour must have a maxGroupSize'],
      // min: 100,
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      max: 5,
      // set: (val) => Math.round(val), //4.66666 , 5 xx
      set: (val) => Math.round(val * 10) / 10, // 4.666666, 46.6666, 47, 4.7
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'a tour must have a price'],
    },
    pricediscount: {
      type: Number,
      validate: {
        validator: function (val) {
          return val < this.price;
        },
        message: 'Discount price ({VALUE}) should be below regular price',
      },
    },
    summary: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      required: [true, 'a tour must have a description'],
    },
    imageCover: {
      typeL: String,
      // required:true,
    },
    images: [String],
    createAT: {
      type: Date,
      default: Date.now(),
      select: false, // متظهرش في api لليوزر
    },
    startDates: [Date],
    secretTours: { type: Boolean, default: false },
    startLocation: {
      type: {
        type: String,
        default: 'Point',
        enum: 'Point',
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: 'Point',
        },
        coordinates: [Number],
        address: String,
        description: String,
      },
    ],
    // guides: Array,
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// tourSchema.index({ price: 1 });
tourSchema.index({ startLocation: '2dsphere' });


// when we need to add proprites to json
tourSchema.virtual('durtionweek').get(function () {
  //we write  fun علشان this
  return Math.round(this.duration / 7);
});

tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id',
});

// DOCUMENT MIDDLEWARE: runs before .save() and .create()
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});



tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: ' -passwordChangedAt -__v',
  });
  next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
