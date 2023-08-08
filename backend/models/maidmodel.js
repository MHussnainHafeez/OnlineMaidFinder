const mongoose = require("mongoose");

const gigSchema = new mongoose.Schema({
  maidId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client", // Reference to the "Maid" collection
    required: true,
  },
  fname: {
    type: String,
    required: [true, "Please enter first Name"],
    trim: true,
  },
  lname: {
    type: String,
    required: [true, "Please enter Last Name"],
  },
  expertize: {
    type: String,
    required: [true, "Please enter description"],
  },
  workExperiance: {
    type: Number,
    required: [true, "Please enter work experience"],
  },
  location: {
    type: String,
    required: [true, "Please enter location"],
  },
  price: {
    type: Number,
    default: 0,
  },
  ratings: {
    type: Number,
    default: 0,
  },
  images: [
    {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  ],
  numOfReviews: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      name: {
        type: String,
        required: true,
      },
      rating: {
        type: Number,
        required: true,
      },
      comment: {
        type: String,
        required: true,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Users", gigSchema);
