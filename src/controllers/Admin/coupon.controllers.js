import { Coupon } from "../../models/Admin/coupon.model.js";
import { PackageBooking } from "../../models/User/packageBooking.model.js";
import {User} from "../../models/User/user.model.js"

// Create a new coupon
export const createCoupon = async (req, res) => {
  try {
    const newCoupon = new Coupon(req.body);
    const savedCoupon = await newCoupon.save();
    res.status(201).json(savedCoupon);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all coupons
export const getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find();
    res.status(200).json(coupons);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a coupon by ID
export const getCouponById = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
      return res.status(404).json({ error: "Coupon not found" });
    }
    res.status(200).json(coupon);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a coupon by ID
export const updateCouponById = async (req, res) => {
  try {
    const updatedCoupon = await Coupon.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedCoupon) {
      return res.status(404).json({ error: "Coupon not found" });
    }
    res.status(200).json(updatedCoupon);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a coupon by ID
export const deleteCouponById = async (req, res) => {
  try {
    const deletedCoupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!deletedCoupon) {
      return res.status(404).json({ error: "Coupon not found" });
    }
    res.status(200).json(deletedCoupon);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// export const redeemCoupon = async (req, res) => {
//     const userId = req.params.userId;
//     const couponId = req.params.id;

//     try {
//         // Find the user, coupon, and associated package bookings
//         const user = await User.findById(userId).populate('bookedPackages');
//         const coupon = await Coupon.findById(couponId).populate('mentionedInPackages');
//         const packageBookings = user.bookedPackages || [];

//         if (!user || !coupon) {
//             return res.status(404).json({ error: "User or Coupon not found" });
//         }

//         // Check if the user has already redeemed the coupon
//         if (Array.isArray(user.redeemedCoupons) && user.redeemedCoupons.includes(couponId)) {
//             return res.status(400).json({ error: "User has already redeemed this coupon" });
//         }

//         // Check if the coupon can still be redeemed
//         if (coupon.maxRedemption > 0 && coupon.couponCodeRedemptionLimit <= 0) {
//             return res.status(400).json({ error: "Coupon redemption limit reached" });
//         }

//         // Check if the coupon was mentioned in any package booking
//         const mentionedInPackageBooking = packageBookings.some((booking) =>
//             booking.coupon && booking.coupon.equals(coupon._id)
//         );

//         // If the coupon was mentioned in a package booking, increment the redemption limit
//         if (mentionedInPackageBooking) {
//             coupon.couponCodeRedemptionLimit++;
//         }

//         // Initialize the user's redeemed coupons array if it's not defined
//         user.redeemedCoupons = user.redeemedCoupons || [];

//         // Push the couponId into the user's redeemed coupons array
//         user.redeemedCoupons.push(couponId);

//         // Save the changes
//         await coupon.save();
//         await user.save();

//         res.status(200).json({ message: "Coupon redeemed successfully" });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

// Modify coupon code limit in such a way that if coupon is mentioned in packageBooking and uesr bookedPackage and user redeemed coupon then count ++ in coupon redemption limit of coupon table
// After sucessfully coupon redeemed by 1 user same user is not able to redmeed this and if maxredemption = 1 then 1 user is able to redeem coupon 1 time only and couponCodeRedemptionLimit = 100 means only first 100 who sucessfully redemeeed coupon and 101 users who are redemedd failed to redeem
// How do i track in coupon table  if couponCodeRedemptionLimit is 100 then user1 redeem 2 coupon and user2 redeem 3 coupon then my output is 100-5=95 


//-------Working Fine---------

// export const redeemCoupon = async (req, res) => {
//     const userId = req.params.userId;
//     const couponId = req.params.id;

//     try {
//         // Find the user, coupon, and associated package bookings
//         const user = await User.findById(userId).populate('bookedPackages');
//         const coupon = await Coupon.findById(couponId).populate('mentionedInPackages');
//         const packageBookings = user.bookedPackages || [];

//         if (!user || !coupon) {
//             return res.status(404).json({ error: "User or Coupon not found" });
//         }

//         // Check if the user has already redeemed the coupon
//         if (Array.isArray(user.redeemedCoupons) && user.redeemedCoupons.includes(couponId)) {
//             return res.status(400).json({ error: "User has already redeemed this coupon" });
//         }

//         // Check if the coupon can still be redeemed
//         if (coupon.maxRedemption === 1 && coupon.couponCodeRedemptionLimit <= 0) {
//             return res.status(400).json({ error: "Coupon can be redeemed only once, and it has already been redeemed" });
//         }

//         // Check if the coupon was mentioned in any package booking
//         const mentionedInPackageBooking = packageBookings.some((booking) =>
//             booking.coupon && booking.coupon.equals(coupon._id)
//         );

//         // If the coupon was mentioned in a package booking, increment the redemption limit
//         if (mentionedInPackageBooking) {
//             coupon.couponCodeRedemptionLimit++;
//         }

//         // Initialize the user's redeemed coupons array if it's not defined
//         user.redeemedCoupons = user.redeemedCoupons || [];

//         // Check if the total redemption limit is reached
//         if (coupon.maxRedemption !== -1 && coupon.maxRedemption <= 0) {
//             return res.status(400).json({ error: "Coupon redemption limit reached" });
//         }

//         // Push the couponId into the user's redeemed coupons array
//         user.redeemedCoupons.push(couponId);

//         // Update the total redemption limit if it's not unlimited
//         if (coupon.maxRedemption !== -1) {
//             coupon.maxRedemption--;
//         }

//         // Save the changes
//         await coupon.save();
//         await user.save();

//         res.status(200).json({ message: "Coupon redeemed successfully" });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

//------Keep track of how many redemption left-------------
export const redeemCoupon = async (req, res) => {
    const userId = req.params.userId;
    const couponId = req.params.id;

    try {
        // Find the user, coupon, and associated package bookings
        const user = await User.findById(userId).populate('bookedPackages');
        const coupon = await Coupon.findById(couponId).populate('mentionedInPackages');
        const packageBookings = user.bookedPackages || [];

        if (!user || !coupon) {
            return res.status(404).json({ error: "User or Coupon not found" });
        }

        // Check if the user has already redeemed the coupon
        if (Array.isArray(user.redeemedCoupons) && user.redeemedCoupons.includes(couponId)) {
            return res.status(400).json({ error: "User has already redeemed this coupon" });
        }

        // Check if the coupon can still be redeemed
        if (coupon.maxRedemption === 1 && coupon.couponCodeRedemptionLimit <= 0) {
            return res.status(400).json({ error: "Coupon can be redeemed only once, and it has already been redeemed" });
        }

        // Check if the coupon was mentioned in any package booking
        const mentionedInPackageBooking = packageBookings.some((booking) =>
            booking.coupon && booking.coupon.equals(coupon._id)
        );

        // If the coupon was mentioned in a package booking, increment the redemption limit
        if (mentionedInPackageBooking) {
            coupon.couponCodeRedemptionLimit++;
        }

        // Initialize the user's redeemed coupons array if it's not defined
        user.redeemedCoupons = user.redeemedCoupons || [];

        // Check if the total redemption limit is reached
        if (coupon.maxRedemption !== -1 && coupon.maxRedemption <= 0) {
            return res.status(400).json({ error: "Coupon redemption limit reached" });
        }

        // Push the couponId into the user's redeemed coupons array
        user.redeemedCoupons.push(couponId);

        // Update the total redemption limit if it's not unlimited
        if (coupon.maxRedemption !== -1) {
            coupon.maxRedemption--;
        }

        // Update the remaining couponCodeRedemptionLimit
        const remainingRedemptionLimit = coupon.couponCodeRedemptionLimit - user.redeemedCoupons.length;

        // Save the changes
        await coupon.updateOne({
            couponCodeRedemptionLimit: remainingRedemptionLimit,
        });

        await user.save();

        res.status(200).json({ message: "Coupon redeemed successfully", remainingRedemptionLimit });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


