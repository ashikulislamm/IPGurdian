/**
 * Pricing Service for NFT valuation
 * Calculates suggested prices based on multiple factors
 */

class PricingService {
  constructor() {
    // Base pricing factors
    this.basePrices = {
      copyright: 0.05,
      trademark: 0.08,
      patent: 0.15,
      design: 0.06,
      'trade-secret': 0.12
    };

    // Category multipliers
    this.categoryMultipliers = {
      'Software': 1.5,
      'Music': 1.2,
      'Art': 1.3,
      'Literature': 1.1,
      'Patent': 1.8,
      'Trademark': 1.4,
      'Design': 1.2,
      'Technology': 1.6,
      'Entertainment': 1.3,
      'Other': 1.0
    };

    // Engagement multipliers
    this.engagementFactors = {
      viewsWeight: 0.0001,
      favoritesWeight: 0.001,
      minEngagementBonus: 1.0,
      maxEngagementBonus: 2.0
    };
  }

  /**
   * Calculate suggested NFT price
   */
  calculatePrice(ipType, category, metadata = {}, engagement = {}) {
    try {
      // Get base price for IP type
      const basePrice = this.basePrices[ipType] || 0.05;

      // Apply category multiplier
      const categoryMultiplier = this.categoryMultipliers[category] || 1.0;

      // Calculate engagement bonus
      const engagementBonus = this.calculateEngagementBonus(
        engagement.views || 0,
        engagement.favorites || 0
      );

      // Calculate metadata quality bonus
      const qualityBonus = this.calculateQualityBonus(metadata);

      // Final price calculation
      let suggestedPrice = basePrice * categoryMultiplier * engagementBonus * qualityBonus;

      // Ensure minimum and maximum bounds
      suggestedPrice = Math.max(0.01, Math.min(suggestedPrice, 100));

      // Calculate market value (suggested future value)
      const marketValue = suggestedPrice * 2;

      return {
        currentPrice: parseFloat(suggestedPrice.toFixed(4)),
        marketValue: parseFloat(marketValue.toFixed(4)),
        priceBreakdown: {
          basePrice,
          categoryMultiplier,
          engagementBonus,
          qualityBonus
        }
      };
    } catch (error) {
      console.error('Price calculation error:', error);
      return {
        currentPrice: 0.1,
        marketValue: 0.2,
        priceBreakdown: {
          basePrice: 0.1,
          categoryMultiplier: 1.0,
          engagementBonus: 1.0,
          qualityBonus: 1.0
        }
      };
    }
  }

  /**
   * Calculate engagement bonus based on views and favorites
   */
  calculateEngagementBonus(views, favorites) {
    const { viewsWeight, favoritesWeight, minEngagementBonus, maxEngagementBonus } = this.engagementFactors;

    const viewsBonus = views * viewsWeight;
    const favoritesBonus = favorites * favoritesWeight;
    const totalBonus = 1 + viewsBonus + favoritesBonus;

    return Math.max(minEngagementBonus, Math.min(totalBonus, maxEngagementBonus));
  }

  /**
   * Calculate quality bonus based on metadata completeness
   */
  calculateQualityBonus(metadata) {
    let qualityScore = 1.0;

    // Check metadata completeness
    if (metadata.description && metadata.description.length > 100) {
      qualityScore += 0.1;
    }

    if (metadata.attributes && metadata.attributes.length > 3) {
      qualityScore += 0.15;
    }

    if (metadata.image || metadata.files) {
      qualityScore += 0.2;
    }

    // Cap at 1.5x bonus
    return Math.min(qualityScore, 1.5);
  }

  /**
   * Get market statistics for pricing reference
   */
  getMarketStats(nfts = []) {
    if (nfts.length === 0) {
      return {
        avgPrice: 0.1,
        minPrice: 0.01,
        maxPrice: 1.0,
        totalVolume: 0
      };
    }

    const prices = nfts.map(nft => nft.priceETH || 0);
    const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const totalVolume = prices.reduce((a, b) => a + b, 0);

    return {
      avgPrice: parseFloat(avgPrice.toFixed(4)),
      minPrice: parseFloat(minPrice.toFixed(4)),
      maxPrice: parseFloat(maxPrice.toFixed(4)),
      totalVolume: parseFloat(totalVolume.toFixed(4))
    };
  }

  /**
   * Adjust price based on market conditions
   */
  adjustForMarket(basePrice, marketStats) {
    if (!marketStats || marketStats.avgPrice === 0) {
      return basePrice;
    }

    // If base price is significantly different from market average, adjust slightly
    const priceDiff = basePrice - marketStats.avgPrice;
    const adjustment = priceDiff * 0.1; // 10% adjustment factor

    return Math.max(0.01, basePrice - adjustment);
  }
}

const pricingService = new PricingService();
export default pricingService;
