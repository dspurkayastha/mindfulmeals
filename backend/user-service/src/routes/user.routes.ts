import { Router } from 'express';

const router = Router();

// TODO: Implement user routes
router.get('/profile', (req, res) => {
  res.status(501).json({
    success: false,
    message: 'User routes not implemented yet',
    errors: ['NOT_IMPLEMENTED'],
  });
});

export { router as userRoutes };
