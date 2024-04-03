import mongoose from 'mongoose';

const packageBookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    packageName: {
      type: String,
      required: true,
      trim: true,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    pickupLocation: {
      type: String,
      required: true,
      trim: true,
    },
    pickupDate: {
      type: Date,
      required: true,
    },
    pickupTime: {
      type: String,
      //required: true,
    },
    baseFare: {
      type: Number,
      default: 0,
    },
    totalPayableAmount: {
      type: Number,
      default: 0,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    emailID: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    mobileNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    city: {
      type: String,
      trim: true,
    },
    shareOnWhatsapp: {
      type: Boolean,
      default: false,
    },
    coupon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Coupon'
    },
    status: {
      type: String,
      enum: ["upcoming", "ongoing", "past", "cancelled"],
      default:"upcoming",
    },
    carTypes:{
      type:String,
      enum:["premium", "premiumPlus", "luxury"],
      default:"luxury"
    }
  },
  {
    timestamps: true,
  }
);

export const PackageBooking = mongoose.model("PackageBooking", packageBookingSchema);