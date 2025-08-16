import { Router } from 'express';
import { query, validationResult } from 'express-validator';
import { SimpleCommerceService, VendorType } from '../services/simple-commerce.service';

export const router = Router();

// Initialize service
const commerceService = new SimpleCommerceService();

/**
 * @route   GET /api/commerce/vendors
 * @desc    Get all available vendors
 * @access  Public
 */
router.get('/vendors', async (req, res) => {
  try {
    const vendors = commerceService.getAllVendors();
    
    res.json({
      success: true,
      data: vendors,
      message: 'Vendors retrieved successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      errors: ['INTERNAL_ERROR'],
    });
  }
});

/**
 * @route   GET /api/commerce/vendors/:type
 * @desc    Get vendor information
 * @access  Public
 */
router.get('/vendors/:type', async (req, res) => {
  try {
    const { type } = req.params;
    const vendorType = type as VendorType;
    
    try {
      const vendorInfo = commerceService.getVendorInfo(vendorType);
      res.json({
        success: true,
        data: vendorInfo,
        message: 'Vendor information retrieved successfully',
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: 'Vendor not found',
        errors: ['VENDOR_NOT_FOUND'],
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      errors: ['INTERNAL_ERROR'],
    });
  }
});

/**
 * @route   GET /api/commerce/deep-link/:vendor
 * @desc    Generate deep link for vendor app
 * @access  Public
 */
router.get('/deep-link/:vendor', [
  query('query').optional().isString(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array().map(e => e.msg),
      });
    }

    const { vendor } = req.params;
    const { query } = req.query;
    const vendorType = vendor as VendorType;
    
    try {
      const deepLink = commerceService.generateDeepLink(vendorType, query as string);
      const fallbackUrl = commerceService.generateFallbackUrl(vendorType, query as string);
      const appStoreUrl = commerceService.getAppStoreUrl(vendorType);
      
      res.json({
        success: true,
        data: {
          deepLink,
          fallbackUrl,
          appStoreUrl,
          vendor: commerceService.getVendorInfo(vendorType),
        },
        message: 'Deep link generated successfully',
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: 'Vendor not found',
        errors: ['VENDOR_NOT_FOUND'],
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      errors: ['INTERNAL_ERROR'],
    });
  }
});

/**
 * @route   GET /api/commerce/recommendations
 * @desc    Get recommended vendors for user
 * @access  Private (would require auth)
 */
router.get('/recommendations', async (req, res) => {
  try {
    // TODO: Get userId from auth middleware
    const userId = 'temp-user-id';
    const limit = req.query.limit ? Number(req.query.limit) : 3;
    
    const recommendedVendors = await commerceService.getRecommendedVendors(userId, limit);
    const vendorDetails = recommendedVendors.map(vendor => commerceService.getVendorInfo(vendor));
    
    res.json({
      success: true,
      data: vendorDetails,
      message: 'Vendor recommendations retrieved successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      errors: ['INTERNAL_ERROR'],
    });
  }
});

/**
 * @route   POST /api/commerce/track-preference
 * @desc    Track vendor preference (for future analytics)
 * @access  Private (would require auth)
 */
router.post('/track-preference', async (req, res) => {
  try {
    // TODO: Get userId from auth middleware
    const userId = 'temp-user-id';
    const { vendorType } = req.body;
    
    if (!vendorType || !Object.values(VendorType).includes(vendorType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid vendor type',
        errors: ['INVALID_VENDOR_TYPE'],
      });
    }
    
    await commerceService.trackVendorPreference(userId, vendorType);
    
    res.json({
      success: true,
      message: 'Vendor preference tracked successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      errors: ['INTERNAL_ERROR'],
    });
  }
});

export { router as commerceRoutes };
