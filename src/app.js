import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())


//routes import
// import authRoutes from './routes/User/auth.js'

import userRouter from './routes/User/user.routes.js'
import userPhoneOtpRoutes from './routes/User/phoneOtp.routes.js'
import incityTravellRoutes from './routes/User/carBooking.routes.js'
import adminRoutes from './routes/Admin/admin.routes.js'
import agentRoutes from './routes/Agent/agent.routes.js'
import agentPhoneOtproutes from './routes/Agent/phoneOtpAgent.routes.js'
import packageBookingRoutes from './routes/User/packageBooking.routes.js'
import carsRoutes from './routes/Agent/car.routes.js'
import driverRoutes from './routes/Agent/driver.routes.js'
import couponRoutes from './routes/Admin/coupon.routes.js'
import paymentRoutes from './routes/Admin/payment.routes.js'
import refundRoutes from './routes/Admin/refund.routes.js'
import enquiryRoutes from './routes/User/enquiry.routes.js'
import filterRoutes from './routes/Admin/filter.routes.js'
import exportRoutes from './routes/Admin/export.routes.js'
//routes declaration
app.use("api/v1/filter", filterRoutes);
// app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/users/signin", userPhoneOtpRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/agent", agentRoutes);
app.use("/api/v1/agent/login", agentPhoneOtproutes);
app.use("/api/v1/packageBooking", packageBookingRoutes);
app.use("/api/v1/incityTravel", incityTravellRoutes);
app.use("/api/v1/cars", carsRoutes);
app.use("/api/v1/driver", driverRoutes);
app.use("/api/v1/coupon", couponRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/refund", refundRoutes);
app.use("/api/v1/enquiry", enquiryRoutes);
app.use("/api/v1/filter", filterRoutes)
app.use("/api/v1/export", exportRoutes)
// import { Router } from "express";
// import { retrieveEntriesWithFilters } from "./controllers/Admin/filter.controllers.js"
// impoprt 
// const router = Router();
// router.route("/hlo").get(retrieveEntriesWithFilters);

export { app }