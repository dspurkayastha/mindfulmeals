import { Router } from 'express';

const router = Router();

// TODO: Implement household routes
router.get('/profile', (req, res) => {
  res.status(501).json({
    success: false,
    message: 'Household routes not implemented yet',
    errors: ['NOT_IMPLEMENTED'],
  });
});

export { router as householdRoutes };
