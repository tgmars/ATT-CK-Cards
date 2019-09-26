import { Router } from 'express';
import UserRouter from './Users';
import MessageRouter from './Messages';
import cors from 'cors';

// Init router and path
const router = Router();

// Add sub-routes
router.use('/users', UserRouter);
router.use('/messages', MessageRouter);

// Export the base-router
export default router;
