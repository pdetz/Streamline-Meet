// smsService.js

//import SibApiV3Sdk from 'sib-api-v3-sdk';
import pkg from 'sib-api-v3-sdk';
const SibApiV3Sdk = pkg;

// Configure API key authorization
const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY; // Ensure this env var is set!

async function sendBrevoSms(recipientNumber, messageContent, senderName = "CoachPatrick") {
    const apiInstance = new SibApiV3Sdk.TransactionalSMSApi();
    const sendTransacSms = new SibApiV3Sdk.SendTransacSms();

    sendTransacSms.sender = senderName;
    sendTransacSms.recipient = recipientNumber; // e.g., "+12025550123"
    sendTransacSms.content = messageContent;
    sendTransacSms.type = "transactional";

    try {
        const data = await apiInstance.sendTransacSms(sendTransacSms);
        console.log('SMS sent successfully:', JSON.stringify(data));
        return { success: true, messageId: data.messageId || 'N/A' };
    } catch (error) {
        console.error('Error sending SMS:', error);
        let errorMessage = 'Failed to send SMS.';
        if (error.response && error.response.body) {
            errorMessage += ' Brevo API details: ' + JSON.stringify(error.response.body);
            console.error('Brevo API error details:', error.response.body);
        }
        return { success: false, error: errorMessage };
    }
}

export { sendBrevoSms }; // Export the function for use in other files