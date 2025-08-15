// 📁 src/types/order/order.ts
import type { Address } from "../common/address";

/** 📦 Order creation payload */
export interface OrderData {
  shipping_address: Address;
  billing_address: Address;
  payment_method: string;
}

/** 📌 Single order */
export interface Order {
  id: number;
  status: string;
  total: number;
  created_at: string;
  updated_at: string;
  shipping_address: Address;
  billing_address: Address;
  payment_method: string;
  items?: OrderItem[];
}

/** 🛒 Order item */
export interface OrderItem {
  product_id: number;
  name: string;
  quantity: number;
  price: number;
  [key: string]: string | number | undefined;
}

/** 📋 Order list response */
export type OrderListResponse = Order[];

/** 📋 Single order response */
export type OrderDetailResponse = Order;
