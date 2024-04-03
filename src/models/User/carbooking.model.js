// models/User/carBooking.js
import mongoose, { Schema } from "mongoose";

const CarBooking = new Schema(
    {
        userId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        fullName: {
            type: String,
            trim: true,
        },
        mobileNo: {
            type: String,
            trim: true,
        },
        city: {
            type: String,
            trim: true,
        },
        pickupDateAndTime: {
            type: Date,
        },
        tripType: {
            type: String,
            enum: ["one-way", "round-trip"],
        },
        dropDateAndTime: {
            type: Date,
        },
        vehicle: {
            type: String,
            trim: true,
        },
        distance: {
            type: Number,
        },
        baseFare: {
            type: Number,
        },
        gst: {
            type: Number,
        },
        otherCharges: {
            type: Number,
        },
        totalFare: {
            type: Number,
        },
        addons: {
            type: String,
            trim: true,
        },
        addonsCharges: {
            type: Number,
        },
    },
    {
        timestamps: true,
    }
);

export const carBooking = mongoose.model("CarBooking", CarBooking);


