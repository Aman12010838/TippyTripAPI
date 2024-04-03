// controllers/Agent/otp.controllers.js
import { Agent }  from "../../models/Agent/agent.model.js";
import { generateOTP, sendOTP } from "../../utils/phoneOtp.js";
import jwt from "jsonwebtoken";

export const generateOTPcontroller = async (req, res) => {
    const phone = req.body.phone;
    
    try {
      let agent = await Agent.findOne({ phone: phone });
  
      // If agent does not exist, create a new agent
      if (!agent) {
        agent = new Agent({ phone: phone });
      }
  
      // If agent is blocked, return an error
      if (agent.isBlocked) {
        const currentTime = new Date();
        if (currentTime < agent.blockUntil) {
          return res.status(403).send("Account blocked. Try after some time.");
        } else {
          agent.isBlocked = false;
          agent.OTPAttempts = 0;
        }
      }
  
      // Check for a minimum 1-minute gap between OTP requests
      const lastOTPTime = agent.OTPCreatedTime;
      const currentTime = new Date();
  
      if (lastOTPTime && currentTime - lastOTPTime < 60000) {
        return res
          .status(403)
          .send("Minimum 1-minute gap required between OTP requests");
      }
  
      const OTP = generateOTP();
      agent.OTP = OTP;
      agent.OTPCreatedTime = currentTime;
  
      await agent.save();
  
      sendOTP(phone, OTP);
  
      res.status(200).send("OTP sent successfully");
    } catch (err) {
      console.log(err);
      res.status(500).send("Server error");
    }
}

export const resendOTP = async (req, res) => {
    const agentId = req.params.id;
  
    try {
      const agent = await Agent.findById(agentId);
  
      if (!agent) {
        return res.status(404).send("Agent not found");
      }
  
      // If agent is blocked, return an error
      if (agent.isBlocked) {
        const currentTime = new Date();
        if (currentTime < agent.blockUntil) {
          return res.status(403).send("Account blocked. Try after some time.");
        } else {
          agent.isBlocked = false;
          agent.OTPAttempts = 0;
        }
      }
  
      // Check for a minimum 1-minute gap between OTP requests
      const lastOTPTime = agent.OTPCreatedTime;
      const currentTime = new Date();
  
      if (lastOTPTime && currentTime - lastOTPTime < 60000) {
        return res
          .status(403)
          .send("Minimum 1-minute gap required between OTP requests");
      }
  
      const OTP = generateOTP();
      agent.OTP = OTP;
      agent.OTPCreatedTime = currentTime;
  
      await agent.save();
  
      sendOTP(agent.phone, OTP);
  
      res.status(200).send("OTP resent successfully");
    } catch (err) {
      console.log(err);
      res.status(500).send("Server error");
    }
}

export const verifyOTPlogIn = async (req, res) => {
    const phone = req.body.phone;
    const OTP = req.body.OTP;
  
    try {
      const agent = await Agent.findOne({ phone: phone });
  
      if (!agent) {
        return res.status(404).send("Agent not found");
      }
  
      // Check if agent account is blocked
      if (agent.isBlocked) {
        const currentTime = new Date();
        if (currentTime < agent.blockUntil) {
          return res.status(403).send("Account blocked. Try after some time.");
        } else {
          agent.isBlocked = false;
          agent.OTPAttempts = 0;
        }
      }
  
      // Check OTP
      if (agent.OTP !== OTP) {
        agent.OTPAttempts++;
  
        // If OTP attempts >= 5, block agent for 1 hour
        if (agent.OTPAttempts >= 5) {
          agent.isBlocked = true;
          let blockUntil = new Date();
          blockUntil.setHours(blockUntil.getHours() + 1);
          agent.blockUntil = blockUntil;
        }
  
        await agent.save();
  
        return res.status(403).send("Invalid OTP");
      }
  
      // Check if OTP is within 5 minutes
      const OTPCreatedTime = agent.OTPCreatedTime;
      const currentTime = new Date();
  
      if (currentTime - OTPCreatedTime > 5 * 60 * 1000) {
        return res.status(403).send("OTP expired");
      }
  
      // Generate JWT
      const token = jwt.sign({ phone: agent.phone, role: agent.role }, process.env.SECRET_KEY, {
        expiresIn: "1h",
      });
  
      // Clear OTP
      agent.OTP = undefined;
      agent.OTPCreatedTime = undefined;
      agent.OTPAttempts = 0;

      await agent.save();

      res.json({ token,  agent});
      console.log("Agent logged in successfully");
    } catch (err) {
      console.log(err);
      res.status(500).send("Server error");
    }
}
