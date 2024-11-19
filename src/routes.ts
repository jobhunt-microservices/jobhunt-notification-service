import { healthController } from '@notifications/controllers/health.controller';
import express, { Router } from 'express';

const router: Router = express.Router();

export function healthRoutes(): Router {
  return router.get('/notification-health', healthController.health);
}
