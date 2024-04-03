import mongoose, { Schema } from "mongoose";

const driverSchema = new Schema(
    {
        fullName: {
            type: String,
            trim: true,
            required: true,
        },
        contactNo: {
            type: String,
            trim: true,
            required: true,
        },
        alternateContactNo: {
            type: String,
            trim: true,
            required: true,
        },
        address: {
            type: String,
            trim: true,
            required: true,
        },
        email: {
            type: String,
            unique: true,
            lowercase: true,
            trim: true,
            required: true,
        },
        dlNumber: {
            type: String,
            trim: true,
            required: true,
        },
        dlImage: {
            type: String,
            trim: true,
            required: true,
        },
        panCard: {
            type: String,
            trim: true,
            required: true,
        },
        aadharCard: {
            type: String,
            trim: true,
            required: true,
        },
        driverImage: {
            type: String,
            required: true,
            trim: true,
        },
        chequeCopy: {
            type: String,
            trim: true,
        },
        bankName: {
            type: String,
            trim: true,
        },
        branch: {
            type: String,
            trim: true,
        },
        accNo: {
            type: String,
            trim: true,
        },
        IFSC: {
            type: String,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

export const Driver = mongoose.model("Driver", driverSchema);
