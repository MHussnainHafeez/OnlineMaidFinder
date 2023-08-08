const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  placeInfo: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    phoneNo: {
      type: Number,
      required: true,
    },
  },
  bookMaid: [
    {
      name: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      image: {
        type: String,
        required: true,
      },
      maid: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
      },
     
    },
  ],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "client",
    // required: true,
  },
  availability:{
    type: Boolean,
    default :true
  },
  paymentInfo: {
    id: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
  },
  paidAt: {
    type: Date,
    required: true,
  },
  totalprice: {
    type: Number,
    required: true,
    default: 0,
  },
  bookingStatus: {
    type: String,
    required:true,
    default:"processing"
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model("booking", bookingSchema);
