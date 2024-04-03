import express from 'express';
import { retrieveEntriesWithFilters } from '../../controllers/Admin/filter.controllers.js';

const router = express.Router();

router.get('/filteredData', retrieveEntriesWithFilters);
export default router;
