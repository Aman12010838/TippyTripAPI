import express from "express";

import 
{
    createPackageBooking,
    getPackageBookings,
    getPackageBookingById,
    getPackageBookingsByUserId,
    generateAndSendInvoice,
    updatePackageBooking
    // getPackageNameBySearch
} 
from "../../controllers/User/packageBooking.controllers.js";


const router = express.Router();


router.route("/create").post(createPackageBooking);
// router.post("/create", roleAuthorization(['admin']), createPackageBooking);
router.route("/getAll").get(getPackageBookings);
router.route("/get/:id").get(getPackageBookingById);
router.route('/update/:userId').put(updatePackageBooking);
router.route("/getbyUserId/:userId").get(getPackageBookingsByUserId);
router.route('/generate-invoice/:id').post(generateAndSendInvoice);
// router.route('/packageName-search/').get(getPackageNameBySearch);


export default router;