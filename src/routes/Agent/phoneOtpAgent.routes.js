import express from "express";
const router = express.Router();

import { generateOTPcontroller, resendOTP, verifyOTPlogIn } from "../../controllers/Agent/phoneOtpAgent.controllers.js";

router.route("/generateOTP").post(generateOTPcontroller);
router.route("/resendOTP/:id").post(resendOTP);
router.route("/VerifyOTPlogIn").post(verifyOTPlogIn) ;


export default router