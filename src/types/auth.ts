/**
 * Authentication and order history data models for simulated frontend auth.
 */

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface SavedAddress {
  name: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
}

export interface OrderRecord {
  id: string;
  itemsSummary: string;
  itemsCount: number;
  subtotal: number;
  tax: number;
  deliveryFee: number;
  total: number;
  date: string;
  status: string;
  deliveryAddress: SavedAddress;
  paymentMethod: string;
}
