import express from 'express';
import emailRoutes from './emailRoutes.js'; // Import email routes
import brevoRoutes from './brevoRoutes.js'; // Import Brevo routes

const router = express.Router();

// Mount email routes under '/api' (or whatever prefix you use in main server)
router.use('/', emailRoutes); // No prefix here, '/api' comes from parent app.use
router.use('/', brevoRoutes); // No prefix here, '/api' comes from parent app.use

export default router;