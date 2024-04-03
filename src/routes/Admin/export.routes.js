import express from 'express';
import { exportBSONToExcel } from '../../controllers/Admin/export.controllers.js';

const router = express.Router();

router.get('/exportFilteredData', exportBSONToExcel);

export default router;
