// controllers/Admin/admin.controller.js
import { Admin } from "../../models/Admin/admin.model.js";
import { generateOTP, sendOTP}  from "../../utils/Admin/emailOtp.util.js"
import jwt from "jsonwebtoken"
import nodemailer from "nodemailer";
import bcrypt from "bcrypt"
import ExcelJS from "exceljs";

export const createAdmin = async (req, res) => {
  try {
    const { name, email, mobile, role } = req.body;

    // Check if the admin with the provided email already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ error: "Admin with this email already exists" });
    }

    // Create a new admin without a password
    const newAdmin = new Admin({
      name,
      email,
      mobile,
      role,
    });

    // Save the new admin to the database
    const savedAdmin = await newAdmin.save();

    const generatePasswordCreationLink = (userId) => {
      // Logic to generate a password creation link
      return `https://yourapp.com/set-password/${userId}`;
    };

    const sendPasswordCreationLink = async (email, link) => {
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
        subject: "Password Creation Link",
        text: `Click on the link to create your password: ${link}`,
      };

      try {
        // await transporter.sendMail(mailOptions);
        // // console.log("Email sent: " + info.response);
        // console.log("Email sent: " + response);
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log(error);
          } else {
            console.log("Email sent: " + info.response);
          }
        });
      } catch (error) {
        console.error(error);
      }

      
    };


    const passwordCreationLink = generatePasswordCreationLink(savedAdmin._id);
    await sendPasswordCreationLink(savedAdmin.email, passwordCreationLink);

    res.status(201).json(savedAdmin);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};


// Controller for password creation
export const createPassword = async (req, res) => {
  const { userId } = req.params;
  const { password } = req.body;

  try {
    const admin = await Admin.findById(userId);

    if (!admin) {
      return res.status(404).json({ error: "Admin not found" });
    }

    // admin.password = password;
    const hashedPassword = await bcrypt.hash(password, 10);
    admin.password = hashedPassword;
    await admin.save();

    res.status(200).json({ message: "Password created successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Admin login 

export const generateOTPforAdmin = async (req, res) => {
  try {
    let { email, password } = req.body;
    password = await bcrypt.hash(password, 10);
    // Find the admin by email
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(404).json({ error: "Admin not found" });
    }

    // Compare the provided password with the stored hashed password

    const comparePassword = async function (password) {
      try {
        
        const isMatch = await bcrypt.compare(password, this.password);
        return isMatch;
      } catch (error) {
        return false;
      }
    };
    const isPasswordMatch = comparePassword(password);

    if (!isPasswordMatch) {
      return res.status(401).json({ error: "Incorrect password" });
    }


    // If user is blocked, return an error
    if (admin.isBlocked) {
      const currentTime = new Date();
      if (currentTime < admin.blockUntil) {
        return res.status(403).send("Account blocked. Try after some time.");
      } else {
        admin.isBlocked = false;
        admin.OTPAttempts = 0;
      }
    }

    // Check for minimum 1-minute gap between OTP requests
    const lastOTPTime = admin.OTPCreatedTime;
    const currentTime = new Date();

    if (lastOTPTime && currentTime - lastOTPTime < 60000) {
      return res
        .status(403)
        .send("Minimum 1-minute gap required between OTP requests");
    }

    // Generate and send OTP to the admin's email
    const OTP = generateOTP();
    sendOTP(admin.email, OTP);

    // Store the OTP in the database (you may want to hash or encrypt it)
    admin.OTP = OTP;
    await admin.save();

    res.status(200).json({ message: "OTP sent successfully", userId: admin._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};


export const verifyOTPforAdmin = async (req, res) => {

  try {
    // const email = req.body.email;
    const userId  = req.body.userId;
    const OTP = req.body.OTP;

    const admin = await Admin.findById(userId);

    if (!admin) {
      return res.status(404).send("User not found");
    }

    // Check if user account is blocked
    if (admin.isBlocked) {
      const currentTime = new Date();
      if (currentTime < admin.blockUntil) {
        return res.status(403).send("Account blocked. Try after some time.");
      } else {
        admin.isBlocked = false;
        admin.OTPAttempts = 0;
      }
    }

    // Check OTP
    if (admin.OTP !== OTP) {
      admin.OTPAttempts++;

      // If OTP attempts >= 5, block user for 1 hour
      if (admin.OTPAttempts >= 5) {
        admin.isBlocked = true;
        let blockUntil = new Date();
        blockUntil.setHours(blockUntil.getHours() + 1);
        admin.blockUntil = blockUntil;
      }

      await admin.save();

      return res.status(403).send("Invalid OTP");
    }

    // Check if OTP is within 5 minutes
    const OTPCreatedTime = admin.OTPCreatedTime;
    const currentTime = new Date();

    if (currentTime - OTPCreatedTime > 5 * 60 * 1000) {
      return res.status(403).send("OTP expired");
    }

    // Generate JWT
    const token = jwt.sign({ email: admin.email,role:admin.role }, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });

    // Clear OTP
    admin.OTP = undefined;
    admin.OTPCreatedTime = undefined;
    admin.OTPAttempts = 0;

    await admin.save();
    res.json({ token });
    console.log("User logged in successfully");
  } catch (err) {
    console.log(err);
    res.status(500).send("Server error");
  }
};

// Controllers for resend otp
export const resendOTP = async (req, res) => {
  const { userId } = req.params;

  try {
    // Find the admin by userID
    const admin = await Admin.findById(userId);

    if (!admin) {
      return res.status(404).json({ error: "Admin not found" });
    }

    // If user is blocked, return an error
    if (admin.isBlocked) {
      const currentTime = new Date();
      if (currentTime < admin.blockUntil) {
        return res.status(403).send("Account blocked. Try after some time.");
      } else {
        admin.isBlocked = false;
        admin.OTPAttempts = 0;
      }
    }

    // Check for minimum 1-minute gap between OTP requests
    const lastOTPTime = admin.OTPCreatedTime;
    const currentTime = new Date();

    if (lastOTPTime && currentTime - lastOTPTime < 60000) {
      return res
        .status(403)
        .send("Minimum 1-minute gap required between OTP requests");
    }

    // Generate and send OTP to the admin's email
    const OTP = generateOTP();
    sendOTP(admin.email, OTP);

    // Store the new OTP in the database (you may want to hash or encrypt it)
    admin.OTP = OTP;
    await admin.save();
    admin.OTPCreatedTime = currentTime;

    res.status(200).json({ message: "OTP resent successfully", userId: admin._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};


// Controller for getting all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await Admin.find();
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};


// Controller for getting user by userid
export const getUserById = async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await Admin.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// Controller for updating admin details
export const updateAdminDetails = async (req, res) => {
  const { userId } = req.params;
  const updateData = req.body;

  try {
    const user = await Admin.findByIdAndUpdate(
      userId,
      updateData,
      { new: true } // This option returns the modified document
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// Controller for exporting Admin user details to Excel File
export const exportAdminToExcel = async (req, res) => {
  try {
    // Fetch all admins from the database
    const admins = await Admin.find();

    if (!admins || admins.length === 0) {
      return res.status(404).json({ error: "No admins found" });
    }

    // Create a new Excel workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Admins");

    // Define the headers for the Excel file
    const headers = ["Name", "Email", "Mobile", "Role", /* Add more columns as needed */];

    // Add the headers to the worksheet
    worksheet.addRow(headers);

    // Populate the worksheet with admin data
    admins.forEach((admin) => {
      const rowData = [
        admin.name,
        admin.email,
        admin.mobile,
        admin.role,
        /* Add more columns as needed */,
      ];

      worksheet.addRow(rowData);
    });

    // Set the content type and disposition of the response
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", "attachment; filename=admins.xlsx");

    // Write the workbook to the response stream
    await workbook.xlsx.write(res);

    // End the response
    res.end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};


