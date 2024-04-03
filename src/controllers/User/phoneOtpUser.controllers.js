import { User }  from "../../models/User/user.model.js"
import { generateOTP, sendOTP}  from "../../utils/phoneOtp.js"
import jwt from "jsonwebtoken"

export const generateOTPcontroller = async (req, res) => {
    const phone = req.body.phone;
    
    try {
      let user = await User.findOne({ phone: phone });
  
      // If user does not exist, create a new user
      if (!user) {
        user = new User({ phone: phone });
      }
  
      // If user is blocked, return an error
      if (user.isBlocked) {
        const currentTime = new Date();
        if (currentTime < user.blockUntil) {
          return res.status(403).send("Account blocked. Try after some time.");
        } else {
          user.isBlocked = false;
          user.OTPAttempts = 0;
        }
      }
  
      // Check for minimum 1-minute gap between OTP requests
      const lastOTPTime = user.OTPCreatedTime;
      const currentTime = new Date();
  
      if (lastOTPTime && currentTime - lastOTPTime < 60000) {
        return res
          .status(403)
          .send("Minimum 1-minute gap required between OTP requests");
      }
  
      const OTP = generateOTP();
      user.OTP = OTP;
      user.OTPCreatedTime = currentTime;
  
      await user.save();
  
      //sendOTP(phone, OTP);  // Gives twilio error as we dont have
  
      res.status(200).send("OTP sent successfully");
    } catch (err) {
      console.log(err);
      res.status(500).send("Server error");
    }
}

export const resendOTP = async (req, res) => {
    const userId = req.params.id;
  
    try {
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).send("User not found");
      }
  
      // If user is blocked, return an error
      if (user.isBlocked) {
        const currentTime = new Date();
        if (currentTime < user.blockUntil) {
          return res.status(403).send("Account blocked. Try after some time.");
        } else {
          user.isBlocked = false;
          user.OTPAttempts = 0;
        }
      }
  
      // Check for a minimum 1-minute gap between OTP requests
      const lastOTPTime = user.OTPCreatedTime;
      const currentTime = new Date();
  
      if (lastOTPTime && currentTime - lastOTPTime < 60000) {
        return res
          .status(403)
          .send("Minimum 1-minute gap required between OTP requests");
      }
  
      const OTP = generateOTP();
      user.OTP = OTP;
      user.OTPCreatedTime = currentTime;
  
      await user.save();
  
      sendOTP(user.phone, OTP);
  
      res.status(200).send("OTP resent successfully");
    } catch (err) {
      console.log(err);
      res.status(500).send("Server error");
    }
  }

export const VerifyOTPsignIn = async (req, res) => {
    const phone = req.body.phone;
    const OTP = req.body.OTP;
  
    try {
      const user = await User.findOne({ phone: phone });
  
      if (!user) {
        return res.status(404).send("User not found");
      }
  
      // Check if user account is blocked
      if (user.isBlocked) {
        const currentTime = new Date();
        if (currentTime < user.blockUntil) {
          return res.status(403).send("Account blocked. Try after some time.");
        } else {
          user.isBlocked = false;
          user.OTPAttempts = 0;
        }
      }
  
      // Check OTP
      if (user.OTP !== OTP) {
        user.OTPAttempts++;
  
        // If OTP attempts >= 5, block user for 1 hour
        if (user.OTPAttempts >= 5) {
          user.isBlocked = true;
          let blockUntil = new Date();
          blockUntil.setHours(blockUntil.getHours() + 1);
          user.blockUntil = blockUntil;
        }
  
        await user.save();
  
        return res.status(403).send("Invalid OTP");
      }
  
      // Check if OTP is within 5 minutes
      const OTPCreatedTime = user.OTPCreatedTime;
      const currentTime = new Date();
  
      if (currentTime - OTPCreatedTime > 5 * 60 * 1000) {
        return res.status(403).send("OTP expired");
      }
  
      // Generate JWT
      const token = jwt.sign({ phone: user.phone }, process.env.SECRET_KEY, {
        expiresIn: "1h",
      });
  
      // Clear OTP
      user.OTP = undefined;
      user.OTPCreatedTime = undefined;
      user.OTPAttempts = 0;

      await user.save()
      .then(savedUser => {
          console.log('User created successfully:', savedUser);
      })
      .catch(error => {
          console.error('Error creating user:', error);
      });

      res.json({ token });
      console.log("User logged in successfully");
    } catch (err) {
      console.log(err);
      res.status(500).send("Server error");
    }
  }