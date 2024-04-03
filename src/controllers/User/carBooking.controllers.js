// controllers/User/carBooking.controller.js
import { carBooking } from "../../models/User/carbooking.model.js";
export const bookCar = async (req, res) => {
    try {
        const newCarBooking = await carBooking.create(req.body);
        res.status(201).json(newCarBooking);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getBookedCar = async (req, res) => {
    try {
        const userId = req.body.userId; // Assuming the user ID is in the req.body
        const carBookings = await carBooking.find({ userId: userId });

        if (!carBookings || carBookings.length === 0) {
            return res.status(404).json({ error: 'No car bookings found for the specified user ID' });
        }

        res.status(200).json({ carBookings });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};