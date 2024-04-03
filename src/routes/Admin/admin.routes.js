import express from "express";
import * as adminController from "../../controllers/Admin/admin.controllers.js";

const router = express.Router();


router.post("/create-admin",adminController.createAdmin);
router.post("/create-password/:userId", adminController.createPassword);
router.post("/login",  adminController.generateOTPforAdmin)
router.post("/verify-otp", adminController.verifyOTPforAdmin)
router.post("/resend-otp/:userId", adminController.resendOTP);
router.get("/all-users",adminController.getAllUsers);
router.get("/user/:userId", adminController.getUserById);
router.patch("/update/:userId", adminController.updateAdminDetails);
router.get("/export-to-excel", adminController.exportAdminToExcel);

export default router;