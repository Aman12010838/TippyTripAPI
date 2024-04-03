import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    mobile: {
      type: String,
      required: true,
    },
    password: {
      type: String,
    },
    role: {
      type: String,
      enum: ["admin", "manager", "viewer"],
      required: true,
    },
    OTP: {
      type: String
    },
    OTPCreatedTime: {
      type: Date
    },
    OTPAttempts: {
      type: Number,
      default: 0
    },
    isBlocked: {
      type: Boolean,
      default: false
    },
    blockUntil: {
      type: Date
    },
  },{
    timestamps:true,
  }
);
  

export const Admin = mongoose.model("Admin", adminSchema);