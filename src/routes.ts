import express, { Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';

const router: Router = express.Router();

export function healthRoutes(): Router {
  return router.get('/notification-health', (_: Request, res: Response) => {
    res.status(StatusCodes.OK).send('Notification service is healthy');
  });
}
