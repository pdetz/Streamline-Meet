import { get } from 'svelte/store';
import { aMeetConfirmationEmailBody, bMeetConfirmationEmailBody } from './meetConfirmationEmailBody.js';
import { userStore } from '@src/stores.js';
import { meetsToConfirmStore } from '@src/stores.js';
import { weeklyConfirmationEmail } from './weeklyConfirmationEmail.js';

export async function sendMeetEmail(swimmers, parent) {
    if (!parent.email || !parent.email.trim()) return;

    const meets = get(meetsToConfirmStore);
    const links = swimmers.map(swimmer => {
        const swimmerMcIds = swimmer.getMeetConfirmations(meets).map(meetCon => meetCon.objectId);
        return `https://swim-app.vercel.app/coms?i=${swimmerMcIds.join(',')}`;
    });
    let emailBodyText = '';
    swimmers.forEach((swimmer, index) => {
        const link = links[index];
        emailBodyText += `Hello,\n\nPlease click on this link to confirm attendance for ${swimmer.preferredName}:\n${link}\n\nThank you!\n\n`;
    });
    const emailBodyHtml = weeklyConfirmationEmail(swimmers, parent);

    const user = get(userStore);

    if (user.email === '') {
        console.warn("User email is empty, using default sender name.");
        return { success: false, error: 'User email is empty. Cannot send email.' };
    }

    const emailPayload = {
        //recipientEmail: 'patrick.detzner@gmail.com',
        recipientEmail: parent.email,
        subject: `🐊🐊🐊 MEET CONFIRMATION for our Final Meets`,
        htmlContent: emailBodyHtml, // Backend expects 'htmlContent'
        textContent: emailBodyText, // Backend expects 'textContent'
        senderName: user?.name || 'Coach',
        replyToEmail: user?.email
    };

    console.log("Sending email payload:", emailPayload);

    try {
        // Make the POST request to your backend's email sending endpoint
        //const response = await fetch('http://localhost:4001/api/send-swim-team-emails', {
        const response = await fetch('http://localhost:4001/api/send-brevo-emails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify([emailPayload]) // Backend expects an array of email objects
        });

        if (response.ok) {
            const result = await response.json();
            if (result.status === 'success' || result.status === 'partial_success') {
                return { success: true, message: 'Email sent successfully!' };
            } else {
                return { success: false, error: result.message || 'Unknown error from backend.' };
            }
        } else {
            const errorText = await response.text();
            return { success: false, error: `Backend responded with error ${response.status}: ${errorText}` };
        }
    } catch (error) {
        return { success: false, error: `Network or unexpected error: ${error.message}` };
    }
}