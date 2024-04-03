// controllers/User/packageReview.controller.js
import { packageReview } from '../../models/User/packageReview.model.js';

// Get all package reviews
export const getAllPackageReviews = async (req, res) => {
  try {
    const packageReviews = await packageReview.find();
    res.status(200).json(packageReviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get package review by ID
export const getPackageReviewById = async (req, res) => {
  try {
    const packageReviewId = req.params.id;
    const packageReview = await packageReview.findById(packageReviewId);

    if (!packageReview) {
      return res.status(404).json({ error: 'Package review not found' });
    }

    res.status(200).json(packageReview);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


// Get all package reviews approved by admin
export const getAllApprovedPackageReviews = async (req, res) => {
    try {
      const approvedPackageReviews = await packageReview.find({ isApprovedByAdmin: true });
      res.status(200).json(approvedPackageReviews);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

// Create a new package review
export const createPackageReview = async (req, res) => {
  try {
    const { userId, packageId, commentMessage, ratingStar } = req.body;

    const newPackageReview = new packageReview({
      userId,
      packageId,
      commentMessage,
      ratingStar
    });

    const savedPackageReview = await newPackageReview.save();
    res.status(201).json(savedPackageReview);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Update an existing package review
export const updatePackageReview = async (req, res) => {
  try {
    const packageReviewId = req.params.id;
    const updates = req.body;

    const updatedPackageReview = await packageReview.findByIdAndUpdate(packageReviewId, updates, {
      new: true,
    });

    if (!updatedPackageReview) {
      return res.status(404).json({ error: 'Package review not found' });
    }

    res.status(200).json(updatedPackageReview);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Delete a package review by ID
export const deletePackageReview = async (req, res) => {
  try {
    const packageReviewId = req.params.id;

    const deletedPackageReview = await packageReview.findByIdAndDelete(packageReviewId);

    if (!deletedPackageReview) {
      return res.status(404).json({ error: 'Package review not found' });
    }

    res.status(200).json({ message: 'Package review deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
