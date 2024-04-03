import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
    {
        email: {
            type: String,
            lowercase: true,
            trim: true,
        },
        fullName: {
            type: String,
            trim: true,
        },
        city: {
            type: String,
            trim: true,
        },
        phone: {
            type: String,
            required: true,
            unique: true
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
        // password: {
        //     type: String,
        //     required: [true, 'Password is required']
        // }
        bookedPackages: [{ 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'PackageBooking' }],
    },
    {
        timestamps: true
    }
)

export const User = mongoose.model("User", userSchema)