import { Enquiry } from "../../models/User/enquiry.model.js";

// Controller for creating a new enquiry
export const createEnquiry = async (req, res) => {
    try {
        const { tripType, name, email, phoneNo, channel } = req.body;
        const enquiry = new Enquiry({ tripType, name, email, phoneNo, channel });
        const savedEnquiry = await enquiry.save();
        res.status(201).json(savedEnquiry);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};

// Controller for getting all enquiries
export const getAllEnquiries = async (req, res) => {
    try {
        const enquiries = await Enquiry.find();
        res.status(200).json(enquiries);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};

// Controller for getting a single enquiry by ID
export const getEnquiryById = async (req, res) => {
    const { id } = req.params;
    try {
        const enquiry = await Enquiry.findById(id);
        if (!enquiry) {
            return res.status(404).json({ error: "Enquiry not found" });
        }
        res.status(200).json(enquiry);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};

// Controller for updating an enquiry
export const updateEnquiry = async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;
    try {
        const updatedEnquiry = await Enquiry.findByIdAndUpdate(id, updateData, { new: true });
        if (!updatedEnquiry) {
            return res.status(404).json({ error: "Enquiry not found" });
        }
        res.status(200).json(updatedEnquiry);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};

// Controller for deleting an enquiry
export const deleteEnquiry = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedEnquiry = await Enquiry.findByIdAndDelete(id);
        if (!deletedEnquiry) {
            return res.status(404).json({ error: "Enquiry not found" });
        }
        res.status(200).json({ message: "Enquiry deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};
