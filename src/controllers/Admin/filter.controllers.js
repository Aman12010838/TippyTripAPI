//controllers/Admin/filter.controllers.js
import mongoose from "mongoose";

// Define a generic function to retrieve entries with filters from any table
const retrieveEntriesWithFilters = async (req, res) => {
    try {
        // Extract the table name and filters from the request body
        const { tableName, filters } = req.body;

        // Check if the table name is provided
        if (!tableName) {
            return res.status(400).json({ error: "Table name is required" });
        }

        // Get the Mongoose model corresponding to the provided table name
        const Model = mongoose.model(tableName);

        // Check if the model exists
        if (!Model) {
            return res.status(404).json({ error: "Table not found" });
        }

        // Define the query object to apply filters
        let query = {};

        // Apply filters to the query object
        if (filters) {
            for (const [fieldName, value] of Object.entries(filters)) {
                query[fieldName] = value;
            }
        }

        // Retrieve entries with filters from the specified table
        const entries = await Model.find(query);
        // Send the retrieved entries as the response
        res.status(200).json(entries);
    } catch (error) {
        console.error("Error retrieving entries with filters:", error);
        res.status(500).json({ error: "Server error" });
    }
};

export { retrieveEntriesWithFilters };
