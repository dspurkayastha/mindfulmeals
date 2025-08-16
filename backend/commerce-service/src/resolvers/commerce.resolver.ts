import { Resolver, Query, Arg, Field, ObjectType } from 'type-graphql';
import { SimpleCommerceService, VendorType } from '../services/simple-commerce.service';

@ObjectType()
class VendorInfo {
  @Field()
  name!: string;

  @Field()
  icon!: string;

  @Field()
  deliveryTime!: string;

  @Field()
  packageName!: string;
}

@ObjectType()
class DeepLinkInfo {
  @Field()
  deepLink!: string;

  @Field()
  fallbackUrl!: string;

  @Field()
  appStoreUrl!: string;

  @Field(() => VendorInfo)
  vendor!: VendorInfo;
}

@Resolver()
export class CommerceResolver {
  private commerceService: SimpleCommerceService;

  constructor() {
    this.commerceService = new SimpleCommerceService();
  }

  @Query(() => [VendorInfo])
  async getVendors(): Promise<VendorInfo[]> {
    const vendors = this.commerceService.getAllVendors();
    return vendors.map(vendor => this.commerceService.getVendorInfo(vendor.type));
  }

  @Query(() => VendorInfo, { nullable: true })
  async getVendorInfo(@Arg('type') type: string): Promise<VendorInfo | null> {
    try {
      const vendorType = type as VendorType;
      return this.commerceService.getVendorInfo(vendorType);
    } catch (error) {
      return null;
    }
  }

  @Query(() => DeepLinkInfo, { nullable: true })
  async generateDeepLink(
    @Arg('vendor') vendor: string,
    @Arg('query', { nullable: true }) query?: string
  ): Promise<DeepLinkInfo | null> {
    try {
      const vendorType = vendor as VendorType;
      const deepLink = this.commerceService.generateDeepLink(vendorType, query);
      const fallbackUrl = this.commerceService.generateFallbackUrl(vendorType, query);
      const appStoreUrl = this.commerceService.getAppStoreUrl(vendorType);
      const vendorInfo = this.commerceService.getVendorInfo(vendorType);

      return {
        deepLink,
        fallbackUrl,
        appStoreUrl,
        vendor: vendorInfo,
      };
    } catch (error) {
      return null;
    }
  }

  @Query(() => [VendorInfo])
  async getRecommendedVendors(@Arg('limit', { defaultValue: 3 }) limit: number): Promise<VendorInfo[]> {
    // TODO: Get userId from context
    const userId = 'temp-user-id';
    const recommendedVendors = await this.commerceService.getRecommendedVendors(userId, limit);
    return recommendedVendors.map(vendor => this.commerceService.getVendorInfo(vendor));
  }
}
