import express from "express";
import * as driverController from "../../controllers/Agent/driver.controllers.js";

const router = express.Router();

router.post("/createDriver",driverController.createDriver);
router.get("/getAllDrivers",driverController.getAllDrivers);
router.get("/getDriverById/:id",driverController.getDriverById);
router.put("/updateDriverById/:id",driverController.updateDriverById);
router.delete("/deleteDriverById/:id",driverController.deleteDriverById);

export default router;