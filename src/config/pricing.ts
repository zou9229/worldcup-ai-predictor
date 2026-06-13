/**
 * Authoritative pricing catalog.
 *
 * The checkout API uses this as the source of truth for price, credits, and duration.
 * Client-sent price or plan fields are ignored; only product_id is honored.
 *
 * To change pricing, edit this file and redeploy. Admin UI cannot alter prices.
 */

import { PaymentType, type PaymentInterval } from '@/core/payment/types';

export type PricingPlanInfo = {
  name: string;
  interval: PaymentInterval;
  intervalCount: number;
};

export type PricingProduct = {
  productId: string;
  productName: string;
  planName: string;
  description: string;
  type: PaymentType;
  priceInCents: number;
  currency: string;
  credits: number;
  creditsValidDays?: number;
  plan?: PricingPlanInfo;
};

export const pricingCatalog: Record<string, PricingProduct> = {
  worldcup_credits_20: {
    productId: 'worldcup_credits_20',
    productName: 'World Cup AI Credit Pack',
    planName: 'Credit Pack',
    description: '20 premium World Cup AI simulations',
    type: PaymentType.ONE_TIME,
    priceInCents: 199,
    currency: 'usd',
    credits: 20,
    creditsValidDays: 45,
  },
  worldcup_tournament_pass: {
    productId: 'worldcup_tournament_pass',
    productName: 'World Cup AI Tournament Pass',
    planName: 'Tournament Pass',
    description: '100 premium World Cup AI simulations for tournament use',
    type: PaymentType.ONE_TIME,
    priceInCents: 499,
    currency: 'usd',
    credits: 100,
    creditsValidDays: 45,
  },
  worldcup_sponsor_slot: {
    productId: 'worldcup_sponsor_slot',
    productName: 'World Cup Sponsor Inquiry',
    planName: 'Sponsor Inquiry',
    description:
      'Sponsored placement review, inventory availability check, UTM setup guidance, and affiliate copy review',
    type: PaymentType.ONE_TIME,
    priceInCents: 4900,
    currency: 'usd',
    credits: 0,
  },
};

export function getPricingProduct(productId: string): PricingProduct | null {
  if (!productId) return null;
  return pricingCatalog[productId] ?? null;
}

export function listPricingProducts(): PricingProduct[] {
  return Object.values(pricingCatalog);
}
