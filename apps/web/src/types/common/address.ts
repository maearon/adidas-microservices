// 📁 src/types/common/address.ts
// export interface Address {
//   full_name: string;
//   phone_number: string;
//   street: string;
//   city: string;
//   state?: string;
//   postal_code?: string;
//   country: string;
//   [key: string]: string | undefined;
// }

export interface Address {
  _id?: string
  userId?: string
  firstName: string
  lastName: string
  street: string
  apartment?: string
  city: string
  state: string
  zipCode: string
  country: string
  phone: string
  isDefault?: boolean
  type?: "delivery" | "billing" | "both"
  latitude?: number
  longitude?: number
  formattedAddress?: string
}
