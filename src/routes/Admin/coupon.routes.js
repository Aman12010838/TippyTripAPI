import express from "express";
import * as couponController from "../../controllers/Admin/coupon.controllers.js";

const router = express.Router();

router.post("/createCoupons", couponController.createCoupon); // Create a new coupon
router.get("/getCoupons", couponController.getAllCoupons); // Get all coupons
router.get("/getCouponsById/:id", couponController.getCouponById); // Get a single coupon by ID
router.put("/updateCouponsById/:id", couponController.updateCouponById); // Update a coupon by ID
router.delete("/deleteCouponsById/:id", couponController.deleteCouponById); // Delete a coupon by ID
router.post("/users/:userId/coupons/:id/redeem", couponController.redeemCoupon);

export default router;
