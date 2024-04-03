import mongoose, { Schema } from "mongoose";

const couponSchema = new Schema(
    {
        couponCode: {
            type: String,
            trim: true,
        },
        couponCodeRedemptionLimit: {
            type: Number,
            trim: true,
        },
        startDateAndTime: {
            type: Date,
            trim: true,
            required: true,
        },
        endDateAndTime: {
            type: Date,
            trim: true,
            required: true,
        },
        minAmount: {
            type: Number,
            trim: true,
            required: true,
        },
        maxRedemption: {
            type: Number,
            trim: true,
            required: true,
        },
        discountPercentage: {
            type: Number,
            trim: true,
            required: true,
        },
        discountInAmount: {
            type: Number,
            trim: true,
            required: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        isActive: {
            type: Boolean,
            default: false,
        },
        // usersRedeemed: {
        //      type: mongoose.Schema.Types.ObjectId,
        //      ref: 'User' 
        // },
        mentionedInPackages: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'PackageBooking'
        }],

    },
    {
        timestamps: true,
    }
);

export const Coupon = mongoose.model("Coupon", couponSchema);
