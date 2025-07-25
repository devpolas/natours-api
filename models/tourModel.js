const User = require("./userModel");
const mongoose = require("mongoose");
const slugify = require("slugify");

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A Tour must have a name"],
      unique: true,
      trim: true,
      maxLength: [50, "tour name at least 50 character or below"],
      minLength: [10, "tour name at least 10 character or higher"],
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, "Please tell the tour duration!"],
    },
    maxGroupSize: {
      type: Number,
      required: [true, "How to people go together. Please maxGroupSize!"],
    },
    difficulty: {
      type: String,
      enum: {
        values: ["easy", "medium", "hard", "difficult"],
        message: `"{VALUE}" not supported You should choose either "easy", "medium", "hard", "difficult"`,
      },
      required: [true, "A Tour must have a difficulty!"],
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      max: [5, "rating value at least 5 and below 5"],
      min: [1, "rating value Must be at least 1 and higher"],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,

      required: [true, "A Tour must come at a price!"],
    },
    discount: {
      type: Number,
      validate: {
        // this code work only document creation time but update time or patch time not work
        validator: function (val) {
          return val < this.price;
        },
        message: `tour discount : {VALUE} should be bellow price`,
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [
        true,
        "Please tell tour summary cause people are knowing about the tour and may they are interested!",
      ],
    },
    description: {
      type: String,
      trim: true,
      required: [true, "A tour must have a full description!"],
    },
    imageCover: {
      type: String,
      require: [
        true,
        "Please give a awesome cover image for interesting the tour!",
      ],
    },
    images: [String],
    startDates: [Date],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false, // hidden from result
    },
    secretTour: {
      type: Boolean,
      default: false,
    },
    startLocation: {
      type: {
        type: String,
        default: "Point",
        enum: ["Point"],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: "Point",
          enum: ["Point"],
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
        ref: "User",
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// virtual property for tour modal
tourSchema.virtual("durationWeeks").get(function () {
  return this.duration / 7;
});

tourSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "tour",
  localField: "_id",
});

// Document pre middleware run on .save() and .create(). other type of middleware like post
tourSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

//* embed document with mongoose pre middleware
// tourSchema.pre("save", async function (next) {
//   const guidesPromise = this.guides.map(async (id) => await User.findById(id));
//   this.guides = await Promise.all(guidesPromise);

//   next();
// });

// Query middleware
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  next();
});

//Populate middleware
tourSchema.pre(/^find/, function (next) {
  this.populate({ path: "guides", select: "-__v -createAt" });
  next();
});

// aggregate middleware
tourSchema.pre("aggregate", function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  next();
});

const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
