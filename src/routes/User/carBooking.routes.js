import { Router } from "express";
import { bookCar, getBookedCar } from "../../controllers/User/carBooking.controllers.js";
import { generateAndSendInvoice } from "../../controllers/User/carBookingInvoice.contollers.js";

const router = Router();

router.route("/carBooking").post(bookCar);
router.route("/carBooking").get(getBookedCar);

router.route('/invoice/:bookingId').get(generateAndSendInvoice);

export default router;
