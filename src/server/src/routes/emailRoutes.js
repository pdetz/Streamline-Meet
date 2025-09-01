import express from 'express';
import { transporter, GMAIL_EMAIL } from '../config/nodemailerConfig.js';

const router = express.Router();

router.post('/send-swim-team-emails', async (req, res) => {
    const emailsToSend = req.body; // This will be an array of emailPayload objects

    if (!emailsToSend || !Array.isArray(emailsToSend) || emailsToSend.length === 0) {
        return res.status(400).json({ message: 'No email data provided for sending.' });
    }

    if (!GMAIL_EMAIL || !GMAIL_APP_PASSWORD) {
        return res.status(500).json({
            message: "Server not configured for email sending. Please check GMAIL_APP_PASSWORD."
        });
    }

    let successCount = 0;
    let failedEmails = [];

    for (const emailData of emailsToSend) { // Loop through each emailPayload object

        if (!emailData.recipientEmail || !emailData.subject || !emailData.htmlContent || !emailData.textContent) {
            console.warn(`Skipping invalid email entry due to missing required fields: ${JSON.stringify(emailData)}`);
            failedEmails.push({ email: emailData.recipientEmail || 'unknown', reason: 'Missing recipient, subject, or content' });
            continue;
        }

        const mailOptions = {
            from: `Your Swim Team Updates <${GMAIL_EMAIL}>`,
            to: emailData.recipientEmail, // Directly use recipientEmail from emailData
            subject: emailData.subject,   // Directly use subject from emailData
            html: emailData.htmlContent,  // Directly use htmlContent from emailData
            text: emailData.textContent,  // Directly use textContent from emailData
        };

        try {
            await transporter.sendMail(mailOptions);
            console.log(`Email successfully sent to: ${emailData.recipientEmail} (Subject: ${emailData.subject})`);
            successCount++;
        } catch (error) {
            console.error(`Failed to send email to ${emailData.recipientEmail}:`, error.message);
            failedEmails.push({ email: emailData.recipientEmail, reason: error.message });
        }
    }

    if (failedEmails.length > 0) {
        return res.status(200).json({
            message: `Emails sent with some failures. Sent: ${successCount}, Failed: ${failedEmails.length}.`,
            successCount,
            failedEmails,
            status: 'partial_success'
        });
    } else {
        return res.status(200).json({
            message: `Successfully sent emails to all ${successCount} recipients!`,
            status: 'success'
        });
    }
});

export default router;