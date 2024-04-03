import { Payment } from "../../models/Admin/payment.model.js";

export const createPayment = async (req, res) => {
  try {
    const { tripId, paymentId, tripType, amount, platform, paymentDate } = req.body;
    const payment = new Payment({ tripId, paymentId, tripType, amount, platform, paymentDate });
    const savedPayment = await payment.save();
    res.status(201).json(savedPayment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

export const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find();
    res.status(200).json(payments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

export const getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ error: "Payment not found" });
    }
    res.status(200).json(payment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};


