// brevoRoutes.js
import express from 'express';

import Brevo from 'sib-api-v3-sdk';
const sibApiV3Sdk = Brevo;
const router = express.Router();

// brevoRoutes.js (or wherever you handle sending confirmations)
//const { sendBrevoSms } = require('../../smsService'); // Adjust path as needed
import { sendBrevoSms } from '../../smsService.js';

// --- Brevo Configuration ---
// Access ApiClient directly now
const defaultClient = sibApiV3Sdk.ApiClient.instance; // Notice no `sibApiV3Sdk.` prefix
const apiKey = defaultClient.authentications['api-key'];

if (!process.env.BREVO_API_KEY) {
    console.error("BREVO_API_KEY is not defined in environment variables. Brevo sending will fail.");
    // Exit or handle appropriately if API key is absolutely essential for startup
}
const BREVO_API_KEY = process.env.BREVO_API_KEY;

// Access TransactionalEmailsApi directly now
const apiInstance = new sibApiV3Sdk.TransactionalEmailsApi(); // Notice no `sibApiV3Sdk.` prefix

const BREVO_SENDER_EMAIL = process.env.BREVO_SENDER_EMAIL || "your_verified_sender_email@yourdomain.net";

router.post('/send-brevo-emails', async (req, res) => {
    const emailsToSend = req.body;

    if (!emailsToSend || !Array.isArray(emailsToSend) || emailsToSend.length === 0) {
        return res.status(400).json({ message: 'No email data provided for sending.' });
    }

    if (!BREVO_API_KEY) {
        return res.status(500).json({
            message: "Server not configured for email sending. Please check BREVO_API_KEY."
        });
    }

    let successCount = 0;
    let failedEmails = [];

    for (const emailData of emailsToSend) {
        if (!emailData.recipientEmail || !emailData.subject || (!emailData.htmlContent && !emailData.templateId)) {
            console.warn(`Skipping invalid email entry due to missing required fields (recipient, subject, or content/templateId): ${JSON.stringify(emailData)}`);
            failedEmails.push({ email: emailData.recipientEmail || 'unknown', reason: 'Missing recipient, subject, or content/templateId' });
            continue;
        }

        // Access SendSmtpEmail directly now
        const sendSmtpEmail = new sibApiV3Sdk.SendSmtpEmail(); // Notice no `sibApiV3Sdk.` prefix

        sendSmtpEmail.to = [{ email: emailData.recipientEmail }];
        if (emailData.parent?.preferredName || emailData.parent?.lastName) {
             sendSmtpEmail.to[0].name = emailData.parent.preferredName || emailData.parent.lastName;
        }

        sendSmtpEmail.sender = { email: BREVO_SENDER_EMAIL, name: emailData.senderName };
        sendSmtpEmail.subject = emailData.subject;
        // Sending Raw HTML/Text Content Directly
        sendSmtpEmail.htmlContent = emailData.htmlContent;
        sendSmtpEmail.textContent = emailData.textContent;
        sendSmtpEmail.replyTo = { email: emailData.replyToEmail };


        try {
            const sendResponse = await apiInstance.sendTransacEmail(sendSmtpEmail);
            console.log(`Email successfully sent to: ${emailData.recipientEmail} (Subject: ${emailData.subject}). Brevo Message ID: ${sendResponse.messageId}`);
            successCount++;
        } catch (error) {
            console.error(`Failed to send email to ${emailData.recipientEmail}:`, error.response?.body || error.message);
            failedEmails.push({ email: emailData.recipientEmail, reason: error.response?.body?.message || error.message || 'Unknown error' });
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

// ... (other imports and Brevo email setup) ...

router.post('/send-sms', async (req, res) => {
    try {
        const { recipientPhone, message } = req.body; // Assuming these come from the request body

        if (!recipientPhone || !message) {
            return res.status(400).json({ success: false, message: 'Recipient phone and message are required.' });
        }

        const smsResult = await sendBrevoSms(recipientPhone, message);

        if (smsResult.success) {
            res.status(200).json({ success: true, message: 'SMS sent successfully!', messageId: smsResult.messageId });
        } else {
            res.status(500).json({ success: false, message: smsResult.error });
        }
    } catch (error) {
        console.error('Error in /send-confirmation-sms route:', error);
        res.status(500).json({ success: false, message: 'Internal server error.' });
    }
});

export default router;