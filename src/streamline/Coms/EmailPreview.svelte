<script>
    //export let htmlContent = ''; // The HTML string of your email
    export let subject = 'Email Preview'; // Optional title for the preview
    import { weeklyConfirmationEmail } from './weeklyConfirmationEmail.js';
    import { MY_TEAM } from '@src/stores';

    $: myTeam = $MY_TEAM;
    $: meets = myTeam?.meets.slice(7, 10) || [];
    $: htmlContent = weeklyConfirmationEmail();

    let iframeSrcdoc = '';

    // Function to construct the full HTML for the iframe
    // This is important for ensuring styles are properly encapsulated.
    $: {
        iframeSrcdoc = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${subject}</title>
    <style>
        /* Optional: Add some basic reset or body styles for consistency in preview */
        body { margin: 0; padding: 20px; font-family: sans-serif; }
    </style>
</head>
<body>
    ${htmlContent}
</body>
</html>
        `;
    }
</script>

<div class="email-preview-container">
    <h2>{subject}</h2>
    <div class="iframe-wrapper">
        <iframe
            srcdoc={iframeSrcdoc}
            title={subject}
            width="100%"
            height="600px"
            frameborder="0"
            sandbox="allow-popups allow-forms allow-modals"
        ></iframe>
    </div>
    <div class="html-source">
        <h3>HTML Source (for debugging)</h3>
        <textarea readonly bind:value={htmlContent}></textarea>
    </div>
</div>

<style>
    .email-preview-container {
        border: 1px solid #ccc;
        border-radius: 8px;
        padding: 20px;
        background-color: #f9f9f9;
        margin-bottom: 20px;
    }
    h2 {
        margin-top: 0;
        color: #333;
    }
    .iframe-wrapper {
        border: 1px solid #eee;
        background-color: #fff;
        margin-bottom: 20px;
        overflow: auto; /* In case email is wider than iframe */
    }
    iframe {
        display: block; /* Remove extra space below iframe */
        border: none;
        width: 100%;
        height: 600px; /* Adjust height as needed */
    }
    .html-source textarea {
        width: 100%;
        height: 200px;
        border: 1px solid #ddd;
        padding: 10px;
        font-family: monospace;
        background-color: #f0f0f0;
        resize: vertical;
    }
</style>