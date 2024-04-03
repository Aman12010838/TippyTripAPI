import express from 'express';
import * as refundController from '../../controllers/Admin/refund.controllers.js';

const router = express.Router();

router.post('/create', refundController.createRefund);
router.get('/', refundController.getAllRefunds);
router.get('/:id', refundController.getRefundById);
router.put('/:id/update', refundController.updateRefund);

export default router;
