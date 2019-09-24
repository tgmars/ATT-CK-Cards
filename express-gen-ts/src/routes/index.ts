import { Router } from 'express';
import UserRouter from './Users';
import cors from 'cors';

// Init router and path
const router = Router();

// Add sub-routes
router.use('/users', UserRouter);
router.use(cors());

// Export the base-router
export default router;
