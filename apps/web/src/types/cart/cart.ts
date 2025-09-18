// Cart-related types

// TODO: Add code here...

// 📦 Type definitions for Cart (Ruby Service)

import { Product, Variant } from "@/types/product";
import { Nullable, Optional } from "../common";

export interface CartCreate {
  readonly id: string;
  email: string;
  name: string;
  role: boolean;
  avatar?: string;
}

export interface ListParams {
  page?: number;
  [key: string]: Optional<Nullable<unknown>>;
}

export interface Meta {
  total_pages: number;
  current_page: number;
  total_count: number;
}

export interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string
  category?: string;
  quantity: number;
  cart_id: number;
  product?: Product;
  variant?: Variant;
  size: string;
  product_id: number;
  variant_id: number;
  created_at: string;
  updated_at: string;
}

export interface ListResponse<T> {
  cart_id: string;
  guest_cart: boolean;
  cart_items: T[];
  meta: Meta;
}

export interface CreateParams {
  cart: SignUpField;
}

export interface SignUpField {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface CreateResponse<T> {
  cart?: T;
  flash?: [message_type: string, message: string];
  status?: number;
  message?: string;
  errors: Record<string, string[]>;
}

export interface CartShow {
  readonly id: string;
  name: string;
  gravatar_id: string;
  size: number;
  following: number;
  followers: number;
  current_cart_following_cart: boolean;
}

export interface CartEdit {
  name: string;
  email: string;
}

export interface EditResponse {
  cart: CartEdit;
  gravatar: string;
  flash?: [message_type: string, message: string];
}

export interface UpdateParams {
  cart: UpdateField;
}

export interface UpdateField {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface UpdateResponse {
  flash_success?: [message_type: string, message: string];
  error?: string[];
}

export interface Response {
  flash?: [message_type: string, message: string];
}

export interface CartFollow {
  readonly id: string;
  name: string;
  gravatar_id: string;
  size: number;
}

export interface FollowResponse<CartFollow, ICartFollow> {
  carts: CartFollow[];
  xcarts: CartFollow[];
  total_count: number;
  cart: ICartFollow;
}

export interface ICartFollow {
  readonly id: string;
  name: string;
  followers: number;
  following: number;
  gravatar: string;
  micropost: number;
}
