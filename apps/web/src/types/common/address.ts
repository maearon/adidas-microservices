// 📁 src/types/common/address.ts
export interface Address {
  full_name: string;
  phone_number: string;
  street: string;
  city: string;
  state?: string;
  postal_code?: string;
  country: string;
  [key: string]: string | undefined;
}
