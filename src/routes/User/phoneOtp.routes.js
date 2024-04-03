import express from "express";
const router = express.Router();

import { generateOTPcontroller, resendOTP, VerifyOTPsignIn } from "../../controllers/User/phoneOtpUser.controllers.js";

router.route("/generateOTP").post(generateOTPcontroller);
router.route("/resendOTP/:id").post(resendOTP);
router.route("/VerifyOTPsignIn").post(VerifyOTPsignIn) ;


export default router