import { createCar } from "../../controllers/Agent/car.controllers.js";
import express from 'express';
const router = express.Router();

router.route("/registerCar").post(createCar);

export default router;