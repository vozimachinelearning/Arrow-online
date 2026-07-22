const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Create email transporter (shares credentials with LoOper backend)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'vozicomsystems@gmail.com',
    pass: process.env.EMAIL_PASS
  }
});

// --- API Routes ---

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required fields'
      });
    }

    const subjectLabels = {
      'general': 'General Inquiry',
      'sales': 'Enterprise Sales',
      'support': 'Technical Support',
      'feedback': 'Feedback',
      'other': 'Other'
    };

    const mailOptions = {
      from: `"Arrow" <${process.env.EMAIL_USER || 'vozicomsystems@gmail.com'}>`,
      to: process.env.NOTIFICATION_EMAIL || 'arrowlocalpower@gmail.com',
      subject: `[Arrow Contact] ${subjectLabels[subject] || 'General Inquiry'}: ${name}`,
      html: `
        <h2>New Arrow Contact Form Submission</h2>
        <table style="border-collapse: collapse; width: 100%; max-width: 600px;">
          <tr style="background-color: #f5f5f5;">
            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Name</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Email</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${email}</td>
          </tr>
          <tr style="background-color: #f5f5f5;">
            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Subject</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${subjectLabels[subject] || 'General Inquiry'}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; vertical-align: top;">Message</td>
            <td style="padding: 10px; border: 1px solid #ddd; white-space: pre-wrap;">${message}</td>
          </tr>
          <tr style="background-color: #f5f5f5;">
            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Submitted At</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${new Date().toISOString()}</td>
          </tr>
        </table>
      `
    };

    await transporter.sendMail(mailOptions);

    // Send confirmation to user
    const userMailOptions = {
      from: `"Arrow" <${process.env.EMAIL_USER || 'vozicomsystems@gmail.com'}>`,
      to: email,
      subject: 'We received your message - Arrow',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #6d5bd0;">Thank you for contacting us, ${name}!</h2>
          <p>We've received your message and will get back to you as soon as possible.</p>
          <p style="margin-top: 20px;">Our team typically responds within 24 hours during business days.</p>
          <p style="margin-top: 30px; color: #666;">
            Best regards,<br>
            The Arrow Team
          </p>
        </div>
      `
    };

    await transporter.sendMail(userMailOptions);

    console.log(`Arrow contact form submitted by ${email}`);

    res.json({
      success: true,
      message: 'Message sent successfully! We will get back to you soon.'
    });

  } catch (error) {
    console.error('Error processing Arrow contact form:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.'
    });
  }
});

// Subscription endpoint (from pricing page)
app.post('/api/subscribe', async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required fields'
      });
    }

    const mailOptions = {
      from: `"Arrow" <${process.env.EMAIL_USER || 'vozicomsystems@gmail.com'}>`,
      to: process.env.NOTIFICATION_EMAIL || 'arrowlocalpower@gmail.com',
      subject: `[Arrow Subscription] New signup: ${name}`,
      html: `
        <h2>New Arrow Subscription Signup</h2>
        <table style="border-collapse: collapse; width: 100%; max-width: 600px;">
          <tr style="background-color: #f5f5f5;">
            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Name</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Email</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${email}</td>
          </tr>
          <tr style="background-color: #f5f5f5;">
            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Submitted At</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${new Date().toISOString()}</td>
          </tr>
        </table>
        <p style="margin-top: 20px; color: #333; font-weight: bold;">
          ACTION REQUIRED: Send the customer a PayPal invoice for their first month ($10).
        </p>
      `
    };

    await transporter.sendMail(mailOptions);

    // Send confirmation to user
    const userMailOptions = {
      from: `"Arrow" <${process.env.EMAIL_USER || 'vozicomsystems@gmail.com'}>`,
      to: email,
      subject: 'Welcome to Arrow - Your Free Month Starts Now!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #6d5bd0;">Welcome to Arrow, ${name}!</h2>
          <p>Thank you for signing up for Arrow's Individual plan.</p>
          <p><strong>Your free month has started!</strong> You'll receive a PayPal invoice for your first paid month ($10) after the free period ends.</p>
          <div style="background: #f5f5f5; padding: 16px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #333;">What happens next?</h3>
            <ol style="line-height: 1.8;">
              <li>We'll send you download instructions within 24 hours</li>
              <li>Your license key will be emailed to you</li>
              <li>After your free month, you'll receive a PayPal invoice for $10</li>
              <li>Subsequent months are just $2/month</li>
            </ol>
          </div>
          <p style="margin-top: 30px; color: #666;">
            Best regards,<br>
            The Arrow Team
          </p>
        </div>
      `
    };

    await transporter.sendMail(userMailOptions);

    console.log(`Arrow subscription signup from ${email}`);

    res.json({
      success: true,
      message: 'Subscription started! Check your email for next steps.'
    });

  } catch (error) {
    console.error('Error processing subscription:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.'
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Route map — maps URL paths to HTML files
const routes = {
  "/": "index.html",
  "/home": "index.html",
  "/features": "features.html",
  "/pricing": "pricing.html",
  "/download": "download.html",
  "/docs": "docs.html",
  "/support": "support.html",
  "/about": "about.html",
  "/contact": "contact.html",
};

// Serve static assets (CSS, JS, images) normally
app.use(express.static(path.join(__dirname, "public")));

// Serve each page at its canonical path
Object.entries(routes).forEach(([route, file]) => {
  app.get(route, (req, res) => {
    res.sendFile(path.join(__dirname, "public", file));
  });
});

// 404 — unknown paths
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "public", "404.html"));
});

app.listen(PORT, () => {
  console.log(`Arrow site running at http://localhost:${PORT}`);
  console.log(`Available routes: ${Object.keys(routes).join(", ")}`);
});
