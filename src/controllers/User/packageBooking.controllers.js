import { PackageBooking } from "../../models/User/packageBooking.model.js";
import pdf from 'html-pdf';
import nodemailer from 'nodemailer'

export const createPackageBooking = async (req, res) => {
  try {
    const {
      userId,packageName,rating,pickupLocation,pickupDate,pickupTime,baseFare,totalPayableAmount,fullName,emailID,mobileNumber,city,shareOnWhatsapp,status,carTypes
    } = req.body;

      const newPackageBooking = new PackageBooking({
        userId,packageName,rating,pickupLocation,pickupDate,pickupTime,baseFare,totalPayableAmount,fullName,emailID,mobileNumber,city,shareOnWhatsapp,status,carTypes
      });
      const savedPackageBooking = await newPackageBooking.save();

      res.status(201).json({message: 'Package created successfully',savedPackageBooking});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error'});
  }
};

export const getPackageBookings = async (req, res) => {
  try {
    const allPackageBookings = await PackageBooking.find();
    res.status(200).json(allPackageBookings);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

export const getPackageBookingById = async (req, res) => {
  const packageBookingId = req.params.id;

  try {
    const packageBooking = await PackageBooking.findById(packageBookingId);

    if (!packageBooking) {
      return res.status(404).json({ error: "PackageBooking not found" });
    }

    res.status(200).json(packageBooking);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Update status on packageBooking
export const updatePackageBooking = async (req, res) => {
  const userId = req.params.userId;
  const updates = req.body;

  try {
    // Find the package booking by ID and update it
    const updatedPackageBooking = await PackageBooking.findOneAndUpdate({ userId: userId }, updates, { new: true });

    if (!updatedPackageBooking) {
      return res.status(404).json({ error: "PackageBooking not found" });
    }

    res.status(200).json(updatedPackageBooking);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

export const getPackageBookingsByUserId = async (req, res) => {
  const userId = req.params.userId;
  try {
    const packageBookings = await PackageBooking.find({ userId: userId }).populate('userId').exec();
    res.status(200).json(packageBookings);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};


export const generateAndSendInvoice = async (req, res) => {
  const packageBookingId = req.params.id;

  try {
    const packageBooking = await PackageBooking.findById(packageBookingId);

    if (!packageBooking) {
      return res.status(404).json({ error: "PackageBooking not found" });
    }

    const generateInvoiceHTML = (bookingData) => {
      // HTML template for the invoice
      const htmlTemplate = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
            }
            .invoice-header {
              text-align: center;
              padding-bottom:15px;
            }
            .logo {
              max-width: 150px;
              margin-bottom: 20px;
            }
            .invoice-details {
              margin-top: 20px;
              padding-bottom:15px;
            }
            .invoice-table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
            }
            .invoice-table, .invoice-table th, .invoice-table td {
              border: 1px solid #ddd;
            }
            .invoice-table th, .invoice-table td {
              padding: 10px;
              text-align: left;
            }
            .thank-you {
              margin-top: 50px;
              text-align: center;
            }
          </style>
        </head>
        <body>
        <svg
        xmlns='http://www.w3.org/2000/svg'
        width='174'
          height='41'
          viewBox='0 0 174 41'
          fill='none'
          >
          <path
          fill-rule='evenodd'
          clip-rule='evenodd'
        d='M5.25661 8.9139V1H0V23.2826C0 25.957 0.932275 28.2174 2.77396 29.967C4.58604 31.6875 6.81254 32.5638 9.36817 32.5638H11.3007V27.4811H9.36817C8.19665 27.4811 7.25171 27.0986 6.44115 26.3011C5.64871 25.5168 5.25661 24.5484 5.25661 23.2826V13.9966H11.2573V8.9139H5.25661ZM30.9706 9.8386C32.9221 8.71788 34.9932 8.14735 37.1245 8.14648L37.127 8.14648L37.1293 8.14648C40.511 8.14764 43.4393 9.35749 45.8193 11.7325L45.82 11.7332C48.1943 14.1125 49.406 17.0127 49.406 20.341C49.406 23.6691 48.1945 26.5744 45.8197 28.9493L45.8193 28.9496C43.4382 31.3257 40.5082 32.5356 37.1245 32.5356C35.0527 32.5356 33.0142 31.969 31.0827 30.8682L31.0822 30.8679C30.7761 30.693 30.4787 30.5072 30.1914 30.3104V40.7539H24.9348V8.6248H30.1914V10.3247C30.4414 10.1551 30.7008 9.99282 30.9706 9.8386ZM37.1873 27.9361C36.9678 27.9358 36.752 27.9273 36.5398 27.9104C34.756 27.7688 33.222 27.0383 31.8727 25.6846C30.3605 24.1724 29.6213 22.4379 29.6213 20.3845C29.6213 18.3312 30.3605 16.5774 31.8775 15.0313C33.3898 13.4949 35.1243 12.746 37.1728 12.746C39.2213 12.746 40.9365 13.4852 42.4197 15.0071C43.9127 16.5387 44.6374 18.2925 44.6374 20.3652C44.6374 22.4379 43.9175 24.1869 42.4391 25.7039C41.1429 27.0342 39.6548 27.7587 37.9051 27.9106C37.6753 27.9306 37.4409 27.9406 37.2018 27.9409L37.197 27.9409L37.1921 27.9409L37.197 27.9361L37.1921 27.9361L37.1873 27.9361ZM63.7996 8.39258C61.6683 8.39344 59.5972 8.96397 57.6457 10.0847C57.3759 10.2389 57.1165 10.4012 56.8665 10.5708V8.87089H51.6099V41H56.8665V30.5565C57.1538 30.7533 57.4513 30.9391 57.7573 31.114L57.7578 31.1143C59.6893 32.2151 61.7278 32.7817 63.7996 32.7817C67.1833 32.7817 70.1133 31.5718 72.4944 29.1957L72.4948 29.1954C74.8696 26.8205 76.0811 23.9152 76.0811 20.5871C76.0811 17.2588 74.8694 14.3586 72.4951 11.9793L72.4944 11.9785C70.1144 9.60358 67.1861 8.39373 63.8044 8.39258L63.8021 8.39258L63.7996 8.39258ZM63.2149 28.1565C63.4272 28.1734 63.6429 28.1819 63.8624 28.1822L63.8672 28.1822L63.8721 28.1822L63.8672 28.187L63.8721 28.187L63.8769 28.187C64.116 28.1867 64.3504 28.1767 64.5802 28.1567C66.3299 28.0048 67.818 27.2803 69.1142 25.95C70.5926 24.433 71.3125 22.684 71.3125 20.6113C71.3125 18.5386 70.5878 16.7848 69.0948 15.2532C67.6116 13.7313 65.8964 12.9921 63.8479 12.9921C61.7994 12.9921 60.0649 13.741 58.5526 15.2774C57.0356 16.8234 56.2964 18.5773 56.2964 20.6306C56.2964 22.684 57.0356 24.4185 58.5478 25.9307C59.8971 27.2844 61.4311 28.0148 63.2149 28.1565ZM78.9942 36.5105L79.478 37.0978C81.6398 39.6572 84.5295 40.9606 88.0429 40.9606C91.1633 40.9606 93.8527 39.8635 96.0182 37.698C98.1828 35.5334 99.2809 32.859 99.2809 29.7662V8.875H94.0242V22.2001C94.0242 23.6845 93.4996 24.9362 92.3864 26.0584C91.2784 27.1753 90.0374 27.7031 88.5647 27.7031C87.0915 27.7031 85.8461 27.1749 84.7437 26.0591C83.634 24.9359 83.1052 23.6837 83.1052 22.2001V8.875H77.8486V22.2001C77.8486 25.0993 78.9112 27.6234 80.9868 29.6839L80.9873 29.6843C83.0634 31.7402 85.606 32.7858 88.5212 32.7858C90.5212 32.7858 92.2987 32.3753 93.8061 31.5582C93.5391 32.5006 93.0256 33.3446 92.2489 34.1146C91.0414 35.3131 89.6744 35.8828 88.0429 35.8828C86.9582 35.8828 85.9399 35.5795 84.9179 34.9374L84.9174 34.9371C84.6285 34.756 84.3457 34.5919 84.0774 34.4362L84.0761 34.4355C83.8051 34.2782 83.5501 34.1302 83.3045 33.9752C82.8162 33.6671 82.3813 33.3411 81.9925 32.9043L81.5888 32.4506L79.441 35.4794L78.7526 36.2689L78.9942 36.5105ZM15.4607 17.1855H20.7753V32.6462H15.4607V17.1855ZM14.8034 6.14052C15.6185 5.32538 16.7236 4.86677 17.8764 4.86523C19.0291 4.86677 20.1343 5.32538 20.9494 6.14052C21.7645 6.95565 22.2231 8.06076 22.2247 9.21353C22.2247 12.0023 18.9916 14.2633 18.1792 14.8314C18.0822 14.8992 18.0197 14.9429 18.0014 14.9605C17.9679 14.9931 17.9231 15.0113 17.8764 15.0113C17.8297 15.0113 17.7848 14.9931 17.7514 14.9605C17.733 14.9429 17.6705 14.8992 17.5735 14.8314C16.7611 14.2633 13.5281 12.0023 13.5281 9.21353C13.5296 8.06076 13.9882 6.95565 14.8034 6.14052ZM16.7691 10.8706C17.0969 11.0896 17.4822 11.2065 17.8764 11.2065C18.4048 11.2062 18.9116 10.9961 19.2852 10.6224C19.6589 10.2487 19.869 9.742 19.8693 9.21353C19.8693 8.81936 19.7525 8.43404 19.5335 8.1063C19.3145 7.77856 19.0032 7.52311 18.6391 7.37227C18.2749 7.22143 17.8742 7.18196 17.4876 7.25886C17.101 7.33576 16.7459 7.52557 16.4671 7.80429C16.1884 8.08301 15.9986 8.43813 15.9217 8.82472C15.8448 9.21132 15.8843 9.61204 16.0351 9.97621C16.186 10.3404 16.4414 10.6516 16.7691 10.8706Z'
        fill='#FF385C'
        />
      <path
        fill-rule='evenodd'
        clip-rule='evenodd'
        d='M111.257 1V8.9139H117.257V13.9966H111.257V23.2826C111.257 24.5484 111.649 25.5168 112.441 26.3011C113.252 27.0986 114.197 27.4811 115.368 27.4811H117.301V32.5638H115.368C112.813 32.5638 110.586 31.6875 108.774 29.967C106.932 28.2174 106 25.957 106 23.2826V1H111.257Z'
        fill='#222222'
        />
        <path
        d='M126.169 9.28008C125.678 9.5644 125.229 9.88025 124.824 10.2281V9.52948V8.62948H123.924H122.384H121.484V9.52948V30.1901V31.0901H122.384H123.924H124.824V30.1901V16.7497C124.824 15.3079 125.361 14.0416 126.503 12.9142C127.654 11.782 128.93 11.2478 130.374 11.2478C131.795 11.2478 133.132 11.8273 134.407 13.1021L135.943 14.6385V12.4657V10.5403V10.0882L135.581 9.8183C134.068 8.69279 132.439 8.1 130.711 8.1C129.056 8.1 127.535 8.48918 126.169 9.28008Z'
        fill='#222222'
        stroke='#222222'
        stroke-width='1.8'
        />
        <path
        d='M144.468 9.76127V8.86127H143.568H142.028H141.128V9.76127V31.3737V32.2737H142.028H143.568H144.468V31.3737V9.76127ZM140.502 3.16682C140.502 3.7559 140.663 4.35848 141.138 4.80025C141.6 5.23074 142.209 5.36646 142.798 5.36646C143.387 5.36646 143.996 5.23074 144.458 4.80025C144.933 4.35848 145.094 3.7559 145.094 3.16682C145.094 2.57774 144.933 1.97517 144.458 1.53339C143.996 1.1029 143.387 0.967188 142.798 0.967188C142.209 0.967188 141.6 1.1029 141.138 1.53339C140.663 1.97517 140.502 2.57774 140.502 3.16682Z'
        fill='#222222'
        stroke='#222222'
        stroke-width='1.8'
        />
        <path
        fill-rule='evenodd'
        clip-rule='evenodd'
        d='M161.19 8.39258C159.058 8.39344 156.987 8.96397 155.036 10.0847C154.766 10.2389 154.507 10.4012 154.257 10.5708V8.87089H149V41H154.257V30.5565C154.544 30.7533 154.841 30.9391 155.147 31.114L155.148 31.1143C157.079 32.2151 159.118 32.7817 161.19 32.7817C164.573 32.7817 167.503 31.5718 169.885 29.1957L169.885 29.1954C172.26 26.8205 173.471 23.9152 173.471 20.5871C173.471 17.2588 172.26 14.3586 169.885 11.9793L169.885 11.9785C167.505 9.60358 164.576 8.39373 161.195 8.39258L161.192 8.39258M160.605 28.1565C160.817 28.1734 161.033 28.1819 161.253 28.1822C161.254 28.1822 161.256 28.1822 161.257 28.1822C161.259 28.1822 161.261 28.1822 161.262 28.1822L161.257 28.187C161.259 28.187 161.261 28.187 161.262 28.187C161.264 28.187 161.265 28.187 161.267 28.187C161.506 28.1867 161.74 28.1767 161.97 28.1567C163.72 28.0048 165.208 27.2803 166.504 25.95C167.983 24.433 168.703 22.684 168.703 20.6113C168.703 18.5386 167.978 16.7848 166.485 15.2532C165.002 13.7313 163.287 12.9921 161.238 12.9921C159.19 12.9921 157.455 13.741 155.943 15.2774C154.426 16.8234 153.686 18.5773 153.686 20.6306C153.686 22.684 154.426 24.4185 155.938 25.9307C157.287 27.2844 158.821 28.0148 160.605 28.1565Z'
        fill='#222222'
        />
        </svg>
        <div class="invoice-header">
        <h1>Invoice</h1>
        </div>
        <div class="invoice-details">
          <p>Full Name     : ${bookingData.fullName}</p>
          <p>Email ID      : ${bookingData.emailID}</p>
          <p>Mobile Number : ${bookingData.mobileNumber}</p>
          </div>
          <table class="invoice-table">
          <tr>
          <th>Package Name</th>
          <th>Pickup Location</th>
              <th>Pickup Date</th>
              <th>Pickup Time</th>
              <th>Base Fare</th>
              <th>Total Payable Amount</th>
              </tr>
              <tr>
              <td>${bookingData.packageName}</td>
              <td>${bookingData.pickupLocation}</td>
              <td>${bookingData.pickupDate.toDateString()}</td>
              <td>${bookingData.pickupTime}</td>
              <td>${bookingData.baseFare}</td>
              <td>${bookingData.totalPayableAmount}</td>
              </tr>
              </table>
              <div class="thank-you">
            <p>Thank you for choosing our package!</p>
          </div>
          </body>
          </html>
      `;
      // <p>User ID: ${bookingData.userId}</p>
      // <img src="public/logo.png" alt="Logo" class="logo">

      return htmlTemplate;
    };

    // Fetch the recipient's email from the booking data
    const recipientEmail = packageBooking.emailID;

    // Generate HTML content
    const invoiceHTML = generateInvoiceHTML(packageBooking);

    // Set the content type and disposition of the response
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=invoice_${packageBookingId}.pdf`);

    // Convert HTML to PDF and send as response
    pdf.create(invoiceHTML).toStream((err, stream) => {
      if (err) {
        res.status(500).json({ error: "Server error" });
      } else {
        stream.pipe(res);
      }
    });


    // Convert HTML to PDF
    const pdfBuffer = await new Promise((resolve, reject) => {
      pdf.create(invoiceHTML).toBuffer((err, buffer) => {
        if (err) reject(err);
        else resolve(buffer);
      });
    });

    // Setup Nodemailer transport
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_SERVICE_USER,
        pass: process.env.EMAIL_SERVICE_PASS,
      },
    });

    // Send email with PDF attachment
    const mailOptions = {
      from: process.env.EMAIL_SERVICE_USER,
      to: recipientEmail,  // Use the recipient's email obtained from the booking data
      subject: 'Invoice',
      text: 'Please find attached invoice.',
      attachments: [
        {
          filename: `invoice_${packageBookingId}.pdf`,
          content: pdfBuffer,
          encoding: 'base64',
        },
      ],
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).json({ error: "Failed to send email" });
      }
      res.status(200).json({ message: 'Email sent successfully' });
    });

  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};



// Controller for Atlas Search for PackageName Search

// export const getPackageNameBySearch = async (req, res) => {
//   try {
//     const searchTerm = req.param.searchTerm;

//     const searchQuery = [
//       {
//         $search: {
//           index: "searchPackage",
//           text: {
//             query: `{ "$text": { "$search": "${searchTerm}" } }`,
//             path: {
//               wildcard: "*"
//             }
//           }
//         }
//       }
//     ];

//     const allPackageBookings = await PackageBooking.aggregate(searchQuery);

//     res.status(200).json(allPackageBookings);
//   } catch (error) {
//     res.status(500).json({ error: "Server error" });
//   }
// };