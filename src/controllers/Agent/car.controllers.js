// controlles/Agent/car.controllers.js
import jwt from 'jsonwebtoken';
import { Car } from '../../models/Agent/car.model.js';
export const createCar = async (req, res) => {
  try {
    const { name, vehicleCapacity, fuelType, pricing, tagLine, offer, images } = req.body;

    // Check if the request has a valid JWT token
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);

    
    // Check if the agent has the required role (admin or manager) to create a car
    if (decodedToken.role === 'admin' || decodedToken.role === 'manager') {
      // Create a new car
      const newCar = new Car({ name, vehicleCapacity, fuelType, pricing, tagLine, offer, images });
      const savedCar = await newCar.save();

      res.status(201).json({
        message: 'Car created successfully',
        car: savedCar,
      });
    } else {
      res.status(403).json({ error: 'Unauthorized: Only admin or manager can create cars' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
