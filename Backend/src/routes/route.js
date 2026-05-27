import express from 'express';
import { planRoute } from '../controllers/routeController.js';

const router = express.Router();
// when my app sees app.get('/api', filename(eg.rote.js))
//it send the control here
router.post('/route' , planRoute)


export default router;