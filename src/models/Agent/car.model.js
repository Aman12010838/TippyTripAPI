import mongoose from "mongoose";

const carSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  vehicleCapacity: {
    type: Number,
  },
  fuelType: {
    type: String,
  },
  pricing: {
    type: Number,
  },
  tagLine: {
    type: String,
  },
  offer: {
    type: String,
  },
  images: {
    type: String
  }
});

export const Car = mongoose.model("Car", carSchema);
