import crypto from "crypto"
import nodemailer from "nodemailer"


export const generateOTP = () => {
  // Generate 6 character string with number and alphabets
  // return crypto.randomBytes(3).toString("hex"); 
   

  // Generates 6 digits OTP
  const randomBytes = crypto.randomBytes(3); // Generate 3 random bytes
  const otp = parseInt(randomBytes.toString('hex'), 16); // Convert hex to decimal
  const sixDigitOTP = otp % 1000000; // Ensure it's 6 digits
  return sixDigitOTP.toString().padStart(6, '0'); // Ensure leading zeros if needed
};

export const sendOTP = (email, OTP) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_SERVICE_USER,
      pass: process.env.EMAIL_SERVICE_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_SERVICE_USER,
    to: email,
    subject: "Your OTP",
    text: `Your OTP is: ${OTP}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};