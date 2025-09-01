import nodemailer from 'nodemailer';
import 'dotenv/config'; // Make sure dotenv is imported and configured if using .env file

// IMPORTANT: Use environment variables for sensitive credentials!
const GMAIL_EMAIL = 'patrick.detzner+coach@gmail.com'; // Replace with your actual Gmail address
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD; // This MUST be your 16-digit Gmail App Password

// Basic check for the App Password
if (!GMAIL_APP_PASSWORD) {
    console.error("\nERROR: GMAIL_APP_PASSWORD environment variable is not set.");
    console.error("Please set it before starting the server. For Vercel deployment, set it in Project Settings -> Environment Variables.");
}

// Create a Nodemailer transporter object using your Gmail SMTP settings
const transporter = nodemailer.createTransport({
    service: 'gmail', // Use 'gmail' for standard Gmail accounts
    auth: {
        user: GMAIL_EMAIL,
        pass: GMAIL_APP_PASSWORD
    }
});

export { transporter, GMAIL_EMAIL };