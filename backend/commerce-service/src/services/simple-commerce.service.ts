// Simple Commerce Service for App Redirects and Deep Links
// Note: Deep link integration coming soon

export enum VendorType {
  BLINKIT = 'blinkit',
  ZEPTO = 'zepto',
  SWIGGY = 'swiggy',
  LOCAL_KIRANA = 'local_kirana',
  AMAZON_FRESH = 'amazon_fresh',
  BIG_BASKET = 'big_basket',
}

export interface VendorPreference {
  userId: string;
  vendorType: VendorType;
  preferenceScore: number;
  lastUsed: Date;
  totalUses: number;
}

export interface DeepLinkInfo {
  vendorType: VendorType;
  deepLink: string;
  fallbackUrl: string;
  appStoreUrl: string;
  isInstalled: boolean;
}

export class SimpleCommerceService {
  private readonly vendorConfigs = {
    [VendorType.BLINKIT]: {
      name: 'Blinkit',
      packageName: 'com.blinkit.customer',
      deepLinkPrefix: 'blinkit://search?q=',
      webUrl: 'https://blinkit.com/search?q=',
      appStoreUrl: 'https://play.google.com/store/apps/details?id=com.blinkit.customer',
      icon: '🛒',
      deliveryTime: '10-15 minutes',
    },
    [VendorType.ZEPTO]: {
      name: 'Zepto',
      packageName: 'com.zepto.customer',
      deepLinkPrefix: 'zepto://search?q=',
      webUrl: 'https://zepto.in/search?q=',
      appStoreUrl: 'https://play.google.com/store/apps/details?id=com.zepto.customer',
      icon: '⚡',
      deliveryTime: '15-30 minutes',
    },
    [VendorType.SWIGGY]: {
      name: 'Swiggy',
      packageName: 'in.swiggy.android',
      deepLinkPrefix: 'swiggy://search?q=',
      webUrl: 'https://swiggy.com/search?q=',
      appStoreUrl: 'https://play.google.com/store/apps/details?id=in.swiggy.android',
      icon: '🛵',
      deliveryTime: '30-45 minutes',
    },
    [VendorType.LOCAL_KIRANA]: {
      name: 'Local Kirana',
      packageName: 'com.localkirana.app',
      deepLinkPrefix: 'localkirana://search?q=',
      webUrl: 'https://localkirana.com/search?q=',
      appStoreUrl: 'https://play.google.com/store/apps/details?id=com.localkirana.app',
      icon: '🏪',
      deliveryTime: '1-2 hours',
    },
    [VendorType.AMAZON_FRESH]: {
      name: 'Amazon Fresh',
      packageName: 'com.amazon.fresh',
      deepLinkPrefix: 'amazonfresh://search?q=',
      webUrl: 'https://amazon.in/fresh/search?q=',
      appStoreUrl: 'https://play.google.com/store/apps/details?id=com.amazon.fresh',
      icon: '📦',
      deliveryTime: '2-4 hours',
    },
    [VendorType.BIG_BASKET]: {
      name: 'BigBasket',
      packageName: 'com.bigbasket.mobileapp',
      deepLinkPrefix: 'bigbasket://search?q=',
      webUrl: 'https://bigbasket.com/search?q=',
      appStoreUrl: 'https://play.google.com/store/apps/details?id=com.bigbasket.mobileapp',
      icon: '🛍️',
      deliveryTime: '2-4 hours',
    },
  };

  /**
   * Check if a vendor app is installed on the device
   * Note: This is a placeholder for future native app integration
   */
  async checkAppInstalled(vendorType: VendorType): Promise<boolean> {
    // TODO: Implement native app detection
    // For now, return false to simulate app not installed
    return false;
  }

  /**
   * Generate deep link for vendor app with search query
   * Note: Deep link integration coming soon
   */
  generateDeepLink(vendorType: VendorType, searchQuery?: string): string {
    const config = this.vendorConfigs[vendorType];
    if (!config) {
      throw new Error(`Unknown vendor type: ${vendorType}`);
    }

    const query = searchQuery ? encodeURIComponent(searchQuery) : '';
    return `${config.deepLinkPrefix}${query}`;
  }

  /**
   * Generate fallback web URL for vendor
   */
  generateFallbackUrl(vendorType: VendorType, searchQuery?: string): string {
    const config = this.vendorConfigs[vendorType];
    if (!config) {
      throw new Error(`Unknown vendor type: ${vendorType}`);
    }

    const query = searchQuery ? encodeURIComponent(searchQuery) : '';
    return `${config.webUrl}${query}`;
  }

  /**
   * Get app store URL for vendor
   */
  getAppStoreUrl(vendorType: VendorType): string {
    const config = this.vendorConfigs[vendorType];
    if (!config) {
      throw new Error(`Unknown vendor type: ${vendorType}`);
    }

    return config.appStoreUrl;
  }

  /**
   * Get vendor information
   */
  getVendorInfo(vendorType: VendorType) {
    const config = this.vendorConfigs[vendorType];
    if (!config) {
      throw new Error(`Unknown vendor type: ${vendorType}`);
    }

    return {
      name: config.name,
      icon: config.icon,
      deliveryTime: config.deliveryTime,
      packageName: config.packageName,
    };
  }

  /**
   * Get all available vendors
   */
  getAllVendors(): Array<{ type: VendorType; name: string; icon: string; deliveryTime: string }> {
    return Object.entries(this.vendorConfigs).map(([type, config]) => ({
      type: type as VendorType,
      name: config.name,
      icon: config.icon,
      deliveryTime: config.deliveryTime,
    }));
  }

  /**
   * Track vendor preference (for future analytics)
   */
  async trackVendorPreference(userId: string, vendorType: VendorType): Promise<void> {
    // TODO: Implement preference tracking
    // console.log(`User ${userId} used vendor ${vendorType}`);
  }

  /**
   * Get recommended vendors based on user preferences
   */
  async getRecommendedVendors(userId: string, limit: number = 3): Promise<VendorType[]> {
    // TODO: Implement recommendation logic based on user preferences
    // For now, return quick commerce vendors first
    return [VendorType.BLINKIT, VendorType.ZEPTO, VendorType.SWIGGY];
  }

  /**
   * Generate WhatsApp share link for vendor recommendations
   */
  generateVendorShareLink(vendors: VendorType[], searchQuery?: string): string {
    const vendorList = vendors.map(vendor => {
      const config = this.vendorConfigs[vendor];
      return `${config.icon} ${config.name} (${config.deliveryTime})`;
    }).join('\n');

    let message = `🛒 Quick Commerce Recommendations\n\n${vendorList}`;
    
    if (searchQuery) {
      message += `\n\n🔍 Search: ${searchQuery}`;
    }

    message += `\n\n📱 Open in MindfulMeals app`;

    return `https://wa.me/?text=${encodeURIComponent(message)}`;
  }
}
