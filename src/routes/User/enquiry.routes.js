// routes/enquiry.routes.js
import express from "express";
import * as enquiryController  from "../../controllers/User/enquiry.controllers.js";

const router = express.Router();

// Create a new enquiry
router.post("/", enquiryController.createEnquiry);

// Get all enquiries
router.get("/", enquiryController.getAllEnquiries);

// Get a single enquiry by ID
router.get("/:id", enquiryController.getEnquiryById);

// Update an enquiry
router.put("/:id", enquiryController.updateEnquiry);

// Delete an enquiry
router.delete("/:id", enquiryController.deleteEnquiry);

export default router;
