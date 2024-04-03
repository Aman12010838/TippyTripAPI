import crypto from "crypto";
import twilio from "twilio";

export const generateOTP = () => {
  const randomBytes = crypto.randomBytes(3); // Generate 3 random bytes
  const otp = parseInt(randomBytes.toString('hex'), 16); // Convert hex to decimal
  const sixDigitOTP = otp % 1000000; // Ensure it's 6 digits
  return sixDigitOTP.toString().padStart(6, '0'); // Ensure leading zeros if needed
};

export const sendOTP = async (phone, OTP) => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const client = new twilio(accountSid, authToken);

  try {
    await client.messages.create({
      body: "Your OTP is: ${OTP}",
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone,
    });
    console.log('OTP sent successfully via SMS');
  } catch (error) {
    console.error('Error sending OTP via SMS:', error);
    throw error;
  }
};