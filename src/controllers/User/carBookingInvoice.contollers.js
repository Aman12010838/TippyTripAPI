// controllers/User/carBookingInvoice.contollers.js

import { carBooking } from "../../models/User/carbooking.model.js"; 
import pdf from 'html-pdf';
import nodemailer from 'nodemailer';

const generateInvoiceHTML = (booking) => {
  // Customize this function to generate the HTML content for your invoice
  const styles = `
    body {
      font-family: Arial, sans-serif;
    }
    h1 {
      color: #333;
    }
    /* Add more styles as needed */
  `;

  return `
    <html>
      <head>
        <title>Invoice</title>
        <style>${styles}</style>
      </head>
      <body>
        <h1>Invoice for Booking ID: ${booking._id}</h1>
        <p><strong>Full Name:</strong> ${booking.fullName}</p>
        <p><strong>Email:</strong> ${booking.email}</p>
        <p><strong>Mobile Number:</strong> ${booking.mobileNo}</p>
        <p><strong>City:</strong> ${booking.city}</p>
        <p><strong>Pickup Date and Time:</strong> ${booking.pickupDateAndTime}</p>
        <p><strong>Trip Type:</strong> ${booking.tripType}</p>
        <p><strong>Drop Date and Time:</strong> ${booking.dropDateAndTime}</p>
        <p><strong>Vehicle:</strong> ${booking.vehicle}</p>
        <p><strong>Distance:</strong> ${booking.distance} km</p>
        <p><strong>Base Fare:</strong> $${booking.baseFare}</p>
        <p><strong>GST:</strong> $${booking.gst}</p>
        <p><strong>Other Charges:</strong> $${booking.otherCharges}</p>
        <p><strong>Total Fare:</strong> $${booking.totalFare}</p>
        <p><strong>Addons:</strong> ${booking.addons}</p>
        <p><strong>Addons Charges:</strong> $${booking.addonsCharges}</p>
      </body>
    </html>
  `;
};

const sendInvoiceByEmail = async (recipientEmail, pdfFilePath) => {
  try {
    const transporter = nodemailer.createTransport({
      // Set up your email transport configuration
      service: 'gmail',
      auth: {
        user: 'amandeepbareth@gmail.com',
        pass: 'xawghuyhanrofieu',
      },
    });

    const mailOptions = {
      from: 'amandeepbareth@gmail.com',
      to: 'nitesh.k@wesoftek.com',
      subject: 'Invoice for Car Booking',
      text: 'Please find the attached invoice for your recent car booking.',
      attachments: [
        {
          filename: 'invoice.pdf',
          path: pdfFilePath,
        },
      ],
    };

    await transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
        return;
      }
      console.log('Email sent: ' + info.response);
    });
  } catch (error) {
    console.error(error);
  }
};

export const generateAndSendInvoice = async (req, res) => {
  try {
    const bookingId = req.params.bookingId;
    const booking = await carBooking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const invoiceHTML = generateInvoiceHTML(booking);

    // Generate PDF from HTML
    const pdfOptions = { format: 'Letter' };
    pdf.create(invoiceHTML, pdfOptions).toFile('invoice.pdf', (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to generate PDF' });
      }

      // Send PDF as an email attachment
      sendInvoiceByEmail(booking.email, result.filename);

      res.status(200).json({ message: 'Invoice sent successfully' });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
