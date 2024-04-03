import mongoose, { Schema } from "mongoose";

const refundSchema = new Schema(
    {
        tripId:{
            type: mongoose.Schema.Types.ObjectId,
            required:true
        },
        paymentId: {
            type: String,
            required: true
        },
        tripType: {
            type: String,
            required: true
        },
        actualAmount: {
            type: Number,
            required: true
        },
        initiatedAmount: {
            type: Number,
        },
        actualRefundedAmount: {
            type: Number,
        },
        cancelledBy: {
            type: String,
            required: true
        },
        reasonOfCancellation: {
            type: String,
            required: true
        },
        refundAmountReason: {
            type: String,
            required: true
        },
        platform: {
            type: String,
            required: true
        },
        refundCreatedAt: {
            type: Date,
            default: Date.now,
            required: true
        },
        refundCompletedAt: {
            type: Date,
            required: false
        }
    },
    {
        timestamps: true,
    }
);

export const Refund = mongoose.model("Refund", refundSchema);
