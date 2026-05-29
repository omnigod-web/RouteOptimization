import express from 'express';
import { planRoute } from '../controllers/routeController.js';
import { validate } from '../middlewares/validate.js';
import { routeSchema } from '../validators/routeValidator.js';

const router = express.Router();
// when my app sees app.get('/api', filename(eg.rote.js))
//it send the control here
router.post('/route', validate(routeSchema) , planRoute)


export default router;