import { Driver } from "../../models/Agent/driver.model.js";


// Create a new driver
export const createDriver = async (req, res) => {
  try {
    const newDriver = new Driver(req.body);
    const savedDriver = await newDriver.save();
    res.status(201).json(savedDriver);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all drivers
export const getAllDrivers = async (req, res) => {
  try {
    const drivers = await Driver.find();
    res.status(200).json(drivers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single driver by ID
export const getDriverById = async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id);
    if (!driver) {
      return res.status(404).json({ error: "Driver not found" });
    }
    res.status(200).json(driver);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a driver by ID
export const updateDriverById = async (req, res) => {
  try {
    const updatedDriver = await Driver.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedDriver) {
      return res.status(404).json({ error: "Driver not found" });
    }
    res.status(200).json(updatedDriver);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a driver by ID
export const deleteDriverById = async (req, res) => {
  try {
    const deletedDriver = await Driver.findByIdAndDelete(req.params.id);
    if (!deletedDriver) {
      return res.status(404).json({ error: "Driver not found" });
    }
    res.status(200).json(deletedDriver);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
