import mongoose, { Schema } from "mongoose";

const paymentSchema = new Schema(
    {
        tripId:{
            type: mongoose.Schema.Types.ObjectId
        },
        paymentId: {
            type: String,
            required: true
        },
        tripType: {
            type: String,
            required: true
        },
        amount: {
            type: Number,
            required: true
        },
        platform: {
            type: String,
            default:"razorpay"
        },
        paymentDate: {
            type: Date,
            default: Date.now,
            required: true
        }
    },
    {
        timestamps: true,
    }
);

export const Payment = mongoose.model("Payment", paymentSchema);
