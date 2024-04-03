import mongoose from 'mongoose';

const packageReviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Assuming you have a User model
  },
  packageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Package', // Assuming you have a Package model
  },
  commentMessage: {
    type: String,
  },
  ratingStar: {
    type: Number,
    min: 1,
    max: 5,
  },
  isApprovedByAdmin: {
    type: Boolean,
    default: true,
  },
});

export const packageReview = mongoose.model('PackageReview', packageReviewSchema);
