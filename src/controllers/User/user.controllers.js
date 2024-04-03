// controllers/user.controller.js
import { User } from "../../models/User/user.model.js";

export const updateUser = async (req, res) => {
    const phone = req.body.phone;
    const { fullName, email, city } = req.body;

    try {
        // Find the user by phoneNumber
        const user = await User.findOne({ phone: phone });

        if (!user) {
            return res.status(404).send("User not found");
        }

        // Update the user properties
        if (fullName) user.fullName = fullName;
        if (email) user.email = email;
        if (city) user.city = city;

        // Save the updated user
        
        const updatedUser = await user.save();

        res.json({
            message: "User updated successfully",
            user: updatedUser
        });
    } catch (err) {
        console.log(err);
        res.status(500).send("Server error");
    }
};

export const getUserById = async (req, res) => {
    const userId = req.body.userId;

    try {
        // Find the user by userId
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).send("User not found");
        }

        res.json({
            message: "User retrieved successfully",
            user: user
        });
    } catch (err) {
        console.log(err);
        res.status(500).send("Server error");
    }
};
