const express = require('express');
const path = require('path');
const helmet = require('helmet');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static site
app.use(express.static(path.join(__dirname, '..')));

// Simple contact endpoint
app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body || {};
  if (!name || !email || !message) return res.status(400).json({ error: 'Missing fields' });

  // Create transporter from env vars. In production set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS
  let transporter;
  let usingEthereal = false;
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  } else {
    // Create Ethereal test account for safe local testing
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    });
    usingEthereal = true;
  }

  const mailOpts = {
    from: `"Rhema Website" <${process.env.SMTP_USER || 'noreply@example.com'}>`,
    to: process.env.CONTACT_EMAIL || 'info@rhemacares.uk',
    subject: `Website enquiry from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
  };

  try {
    const info = await transporter.sendMail(mailOpts);
    const result = { ok: true };
    if (usingEthereal) {
      // Generate preview URL from Ethereal
      result.previewUrl = nodemailer.getTestMessageUrl(info) || null;
      console.log('Ethereal preview URL:', result.previewUrl);
    }
    return res.json(result);
  } catch (err) {
    console.error('Mail send error', err);
    return res.status(500).json({ error: 'Failed to send email' });
  }
});

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
