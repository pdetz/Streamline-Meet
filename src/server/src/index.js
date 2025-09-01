import 'dotenv/config';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';

import apiRoutes from './routes/index.js'; // <-- NEW: Import the main API router

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// --- Middleware ---
app.use(cors({ origin: 'https://localhost:5173' }));
app.use(express.json()); // Required to parse JSON from frontend POST requests

// --- Mount the API routes ---
// All routes defined in src/server/src/routes/index.js will now be prefixed with '/api'
app.use('/api', apiRoutes); // This will handle '/api/send-swim-team-emails' etc.

// --- Vercel Specific Export (if this file is directly used by Vercel) ---
// For a standard Express app as a serverless function on Vercel, you need to export the app.
// If this file is part of a larger SvelteKit project, SvelteKit handles this automatically.
// If this is a standalone Node.js API project deployed via Vercel, this export is crucial.
export default app;

const PORT = 4001;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
    console.log(`Open your Svelte app at http://localhost:5173 (if using default Svelte dev server)`);
    console.log(`Remember to set GMAIL_APP_PASSWORD environment variable for email sending.`);
});