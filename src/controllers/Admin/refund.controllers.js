import { Refund } from '../../models/Admin/refund.model.js';

export const createRefund = async (req, res) => {
    try {
        const refund = await Refund.create(req.body);
        res.status(201).json(refund);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getAllRefunds = async (req, res) => {
    try {
        const refunds = await Refund.find();
        res.status(200).json(refunds);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};

export const getRefundById = async (req, res) => {
    try {
        const refund = await Refund.findById(req.params.id);
        if (!refund) {
            return res.status(404).json({ error: 'Refund not found' });
        }
        res.status(200).json(refund);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateRefund = async (req, res) => {
    try {
        const refund = await Refund.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!refund) {
            return res.status(404).json({ error: 'Refund not found' });
        }
        res.status(200).json(refund);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};