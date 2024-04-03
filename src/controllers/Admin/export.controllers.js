import ExcelJS from "exceljs";
import mongoose from "mongoose";

const exportBSONToExcel = async (req, res) => {
    try {
        // Extract BSON data from the request body
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
        const data = await Model.find(query);
        
        // Convert BSON data to JSON
        const jsonData = JSON.parse(JSON.stringify(data));

        if (!jsonData || jsonData.length === 0) {
            return res.status(404).json({ error: "No data found" });
        }

        // Extract field names from the first data entry
        const fieldNames = Object.keys(jsonData[0]);

        const excludedFields = ["createdAt", "updatedAt", "__v","OTPAttempts","isBlocked","password"]; // Add more fields if needed
        // Filter out excluded fields
        const filteredFieldNames = fieldNames.filter(fieldName => !excludedFields.includes(fieldName));


        // Create a new Excel workbook and worksheet
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Data");

        // Add field names as headers to the worksheet
        worksheet.addRow(filteredFieldNames);

        // Populate the worksheet with data
        jsonData.forEach((entry) => {
            const rowData = filteredFieldNames.map((fieldName) => entry[fieldName] || "");
            worksheet.addRow(rowData);
        });

        // Set the content type and disposition of the response
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.setHeader("Content-Disposition", "attachment; filename=data.xlsx");

        // Write the workbook to the response stream
        await workbook.xlsx.write(res);

        // End the response
        res.end();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};

export { exportBSONToExcel };
