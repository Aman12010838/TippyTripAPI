import mongoose, { Schema } from "mongoose";

const enquirySchema = new Schema(
    {
        tripType: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        phoneNo: {
            type: String,
            required: true
        },
        channel: {
            type: String,
            required: true
        },
    },
    {
        timestamps: true
    }
);

export const Enquiry = mongoose.model("Enquiry", enquirySchema);
