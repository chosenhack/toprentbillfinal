export type SubscriptionType =
  | 'SITO_1.0'
  | 'FLEET_PRO_SITO_2.0'
  | 'SITO_2.0'
  | 'FLEET_SITO_2.0'
  | 'PERSONALIZZAZIONI'
  | 'BOOKING_ENGINE'
  | 'CUSTOM'
  | 'FLEET_PRO_BOOKING_ENGINE'
  | 'FLEET_BASIC_BOOKING_ENGINE'
  | 'PAY_AS_YOU_GO'
  | 'FLEET_PRO'
  | 'FLEET_BASIC';

export type PaymentFrequency = 'monthly' | 'quarterly' | 'biannual' | 'annual' | 'oneTime';
export type PaymentStatus = 'confirmed' | 'pending' | 'problem' | 'processing';
export type SalesTeam = 'IT' | 'ES' | 'FR' | 'WORLD';
export type PaymentMethod = 'stripe' | 'bank_transfer' | 'cash' | 'crypto';
export type SalesManager = 'Andrea' | 'Davide' | 'Hanna';

export interface BillingInfo {
  companyName: string;
  vatNumber: string;
  country: string;
  address: string;
  sdi: string;
  pec: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  subscriptionType: SubscriptionType;
  paymentFrequency: PaymentFrequency;
  amount: number;
  stripeLink: string;
  crmLink: string;
  billingInfo?: BillingInfo;
  createdAt: string;
  updatedAt: string;
  active: boolean;
  deactivationDate?: string;
  activationDate: string;
  salesTeam: SalesTeam;
  salesManager: SalesManager;
  isLuxury: boolean;
  vehicleCount: number;
  paymentMethod: PaymentMethod;
}

export interface Payment {
  id: string;
  customerId: string;
  amount: number;
  date: string;
  status: PaymentStatus;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}