// Order-related types

// TODO: Add code here...

// 📁 @types/order.ts

/** 📦 Order creation payload */
export interface OrderData {
  shipping_address: any;
  billing_address: any;
  payment_method: string;
}

/** 📌 Single order */
export interface Order {
  id: number;
  status: string;
  total: number;
  created_at: string;
  updated_at: string;
  [key: string]: any;
}

/** 📋 Order list response */
export type OrderListResponse = Order[];

/** 📋 Single order response */
export type OrderDetailResponse = Order;
