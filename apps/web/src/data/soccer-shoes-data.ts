// export interface SoccerShoe {
//   id: number
//   name: string
//   price: number
//   originalPrice?: number
//   collection: string
//   badge?: string
//   modelNumber: string
//   images: string[]
//   variants: {
//     id: number
//     color: string
//     images: [ string
//     thumbnail: string
//   }[]
//   sizes: string[]
//   reviews: {
//     rating: number
//     count: number
//   }
//   description: string
//   details: {
//     surface: string
//     level: string
//     fit: string
//     material: string
//   }
// }

import { Product } from "@/types/product"

export const soccerShoesData: Product[] = [
{
"id": 9,
"jan_code": "VC93-BL-b8e2",
"title": "F50 Messi Elite Firm Ground Cleats",
"name": "F50 Messi Elite Firm Ground Cleats",
"description": "Experience comfort and performance with the new Adidas TankTop 9.",
"description_h5": "Premium TankTop for Soccer",
"specifications": "High-performance fabric, ergonomic design, moisture-wicking",
"care": "Machine wash cold. Tumble dry low.",
"gender": "Men",
"franchise": "Tubular",
"producttype": "Cleats",
"brand": "Adidas",
"category": "Shoes",
"sport": "Soccer",
"currencyId": "USD",
"currencyFormat": "$",
"isFreeShipping": true,
"availableSizes":["36", "37", "38", "39", "40", "41", "42", "43", "44", "45"],
"price": 220.0,
"original_price": 291.0,
"installments": 10,
"created_at": "2025-07-01T16:13:09.862Z",
"updated_at": "2025-07-01T16:13:09.862Z",
"variants":[
{
"id": 33,
"color": "Black",
"price": 220.0,
"original_price": 291.0,
"sku": "SKU9-A",
"stock": 10,
"sizes":["36", "37", "38", "39", "40", "41", "42", "43", "44", "45"],
"product_id": 9,
"created_at": "2025-07-01T16:13:10.356Z",
"updated_at": "2025-07-01T16:13:20.101Z",
"images":["https://ruby-rails-boilerplate-3s9t.onrender.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsiZGF0YSI6NTEsInB1ciI6ImJsb2JfaWQifX0=--821e5de3df9e421947977abb62f7e8fd1bc237a7/eyJfcmFpbHMiOnsiZGF0YSI6eyJmb3JtYXQiOiJwbmciLCJyZXNpemVfdG9fbGltaXQiOls1MDAsNTAwXX0sInB1ciI6InZhcmlhdGlvbiJ9fQ==--11de9828f30c5f5a50ad1b716465b606e8b4c694/detail1.png"],
"avatar_url": "https://ruby-rails-boilerplate-3s9t.onrender.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsiZGF0YSI6NTEsInB1ciI6ImJsb2JfaWQifX0=--821e5de3df9e421947977abb62f7e8fd1bc237a7/eyJfcmFpbHMiOnsiZGF0YSI6eyJmb3JtYXQiOiJwbmciLCJyZXNpemVfdG9fbGltaXQiOls1MDAsNTAwXX0sInB1ciI6InZhcmlhdGlvbiJ9fQ==--11de9828f30c5f5a50ad1b716465b606e8b4c694/detail1.png"
},
{
"id": 34,
"color": "White",
"price": 219.0,
"original_price": 276.0,
"sku": "SKU9-B",
"stock": 10,
"sizes":["36", "37", "38", "39", "40", "41", "42", "43", "44", "45"],
"product_id": 9,
"created_at": "2025-07-01T16:13:26.400Z",
"updated_at": "2025-07-01T16:13:31.556Z",
"images":["https://ruby-rails-boilerplate-3s9t.onrender.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsiZGF0YSI6NTIsInB1ciI6ImJsb2JfaWQifX0=--994a0cf714ea333b8aa201b1a9de12fbeb49a6b8/eyJfcmFpbHMiOnsiZGF0YSI6eyJmb3JtYXQiOiJwbmciLCJyZXNpemVfdG9fbGltaXQiOls1MDAsNTAwXX0sInB1ciI6InZhcmlhdGlvbiJ9fQ==--11de9828f30c5f5a50ad1b716465b606e8b4c694/detail2.png"],
"avatar_url": "https://ruby-rails-boilerplate-3s9t.onrender.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsiZGF0YSI6NTIsInB1ciI6ImJsb2JfaWQifX0=--994a0cf714ea333b8aa201b1a9de12fbeb49a6b8/eyJfcmFpbHMiOnsiZGF0YSI6eyJmb3JtYXQiOiJwbmciLCJyZXNpemVfdG9fbGltaXQiOls1MDAsNTAwXX0sInB1ciI6InZhcmlhdGlvbiJ9fQ==--11de9828f30c5f5a50ad1b716465b606e8b4c694/detail2.png"
},
{
"id": 35,
"color": "Red",
"price": 155.0,
"original_price": 293.0,
"sku": "SKU9-C",
"stock": 10,
"sizes":["36", "37", "38", "39", "40", "41", "42", "43", "44", "45"],
"product_id": 9,
"created_at": "2025-07-01T16:13:39.085Z",
"updated_at": "2025-07-01T16:13:44.948Z",
"images":["https://ruby-rails-boilerplate-3s9t.onrender.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsiZGF0YSI6NTMsInB1ciI6ImJsb2JfaWQifX0=--6e0fc29a0cf962d3d3a77f491ba7a768b93cbf46/eyJfcmFpbHMiOnsiZGF0YSI6eyJmb3JtYXQiOiJwbmciLCJyZXNpemVfdG9fbGltaXQiOls1MDAsNTAwXX0sInB1ciI6InZhcmlhdGlvbiJ9fQ==--11de9828f30c5f5a50ad1b716465b606e8b4c694/detail3.png"],
"avatar_url": "https://ruby-rails-boilerplate-3s9t.onrender.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsiZGF0YSI6NTMsInB1ciI6ImJsb2JfaWQifX0=--6e0fc29a0cf962d3d3a77f491ba7a768b93cbf46/eyJfcmFpbHMiOnsiZGF0YSI6eyJmb3JtYXQiOiJwbmciLCJyZXNpemVfdG9fbGltaXQiOls1MDAsNTAwXX0sInB1ciI6InZhcmlhdGlvbiJ9fQ==--11de9828f30c5f5a50ad1b716465b606e8b4c694/detail3.png"
},
{
"id": 36,
"color": "Blue",
"price": 214.0,
"original_price": 260.0,
"sku": "SKU9-D",
"stock": 10,
"sizes":["36", "37", "38", "39", "40", "41", "42", "43", "44", "45"],
"product_id": 9,
"created_at": "2025-07-01T16:13:52.066Z",
"updated_at": "2025-07-01T16:13:57.450Z",
"images":["https://ruby-rails-boilerplate-3s9t.onrender.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsiZGF0YSI6NTQsInB1ciI6ImJsb2JfaWQifX0=--2d1d64ed628eb1be5fad2c2da95fa4a9c353a490/eyJfcmFpbHMiOnsiZGF0YSI6eyJmb3JtYXQiOiJwbmciLCJyZXNpemVfdG9fbGltaXQiOls1MDAsNTAwXX0sInB1ciI6InZhcmlhdGlvbiJ9fQ==--11de9828f30c5f5a50ad1b716465b606e8b4c694/detail4.png"],
"avatar_url": "https://ruby-rails-boilerplate-3s9t.onrender.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsiZGF0YSI6NTQsInB1ciI6ImJsb2JfaWQifX0=--2d1d64ed628eb1be5fad2c2da95fa4a9c353a490/eyJfcmFpbHMiOnsiZGF0YSI6eyJmb3JtYXQiOiJwbmciLCJyZXNpemVfdG9fbGltaXQiOls1MDAsNTAwXX0sInB1ciI6InZhcmlhdGlvbiJ9fQ==--11de9828f30c5f5a50ad1b716465b606e8b4c694/detail4.png"
}
],
"image_url": "https://ruby-rails-boilerplate-3s9t.onrender.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsiZGF0YSI6NTEsInB1ciI6ImJsb2JfaWQifX0=--821e5de3df9e421947977abb62f7e8fd1bc237a7/eyJfcmFpbHMiOnsiZGF0YSI6eyJmb3JtYXQiOiJwbmciLCJyZXNpemVfdG9fbGltaXQiOls1MDAsNTAwXX0sInB1ciI6InZhcmlhdGlvbiJ9fQ==--11de9828f30c5f5a50ad1b716465b606e8b4c694/detail1.png"
},
{
"id": 70,
"jan_code": "088670",
"title": "Asics Jersey 70",
"name": "Asics Jersey 70",
"description": "Experience comfort and performance with the new Asics Jersey 70.",
"description_h5": "Premium Jersey for Soccer",
"specifications": "High-performance fabric, ergonomic design, moisture-wicking",
"care": "Machine wash cold. Tumble dry low.",
"gender": "Men",
"franchise": "Tubular",
"producttype": "Jersey",
"brand": "Asics",
"category": "Shoes",
"sport": "Soccer",
"currencyId": "USD",
"currencyFormat": "$",
"isFreeShipping": true,
"availableSizes":["36", "37", "38", "39", "40", "41", "42", "43", "44", "45"],
"price": 137.0,
"original_price": 267.0,
"installments": 10,
"created_at": "2025-07-01T16:51:39.987Z",
"updated_at": "2025-07-01T16:51:39.987Z",
"variants":[
{
"id": 277,
"color": "Black",
"price": 137.0,
"original_price": 267.0,
"sku": "SKU70-A",
"stock": 10,
"sizes":["36", "37", "38", "39", "40", "41", "42", "43", "44", "45"],
"product_id": 70,
"created_at": "2025-07-01T16:51:40.485Z",
"updated_at": "2025-07-01T16:51:50.039Z",
"images":["https://ruby-rails-boilerplate-3s9t.onrender.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsiZGF0YSI6NDE3LCJwdXIiOiJibG9iX2lkIn19--4c08658f4191e1054bc311fa7944aa3ef375f071/eyJfcmFpbHMiOnsiZGF0YSI6eyJmb3JtYXQiOiJwbmciLCJyZXNpemVfdG9fbGltaXQiOls1MDAsNTAwXX0sInB1ciI6InZhcmlhdGlvbiJ9fQ==--11de9828f30c5f5a50ad1b716465b606e8b4c694/detail1.png"],
"avatar_url": "https://ruby-rails-boilerplate-3s9t.onrender.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsiZGF0YSI6NDE3LCJwdXIiOiJibG9iX2lkIn19--4c08658f4191e1054bc311fa7944aa3ef375f071/eyJfcmFpbHMiOnsiZGF0YSI6eyJmb3JtYXQiOiJwbmciLCJyZXNpemVfdG9fbGltaXQiOls1MDAsNTAwXX0sInB1ciI6InZhcmlhdGlvbiJ9fQ==--11de9828f30c5f5a50ad1b716465b606e8b4c694/detail1.png"
},
{
"id": 278,
"color": "White",
"price": 180.0,
"original_price": 275.0,
"sku": "SKU70-B",
"stock": 10,
"sizes":["36", "37", "38", "39", "40", "41", "42", "43", "44", "45"],
"product_id": 70,
"created_at": "2025-07-01T16:51:56.544Z",
"updated_at": "2025-07-01T16:52:01.464Z",
"images":[
"https://ruby-rails-boilerplate-3s9t.onrender.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsiZGF0YSI6NTEsInB1ciI6ImJsb2JfaWQifX0=--821e5de3df9e421947977abb62f7e8fd1bc237a7/eyJfcmFpbHMiOnsiZGF0YSI6eyJmb3JtYXQiOiJwbmciLCJyZXNpemVfdG9fbGltaXQiOls1MDAsNTAwXX0sInB1ciI6InZhcmlhdGlvbiJ9fQ==--11de9828f30c5f5a50ad1b716465b606e8b4c694/detail1.png"
],
"avatar_url": "https://ruby-rails-boilerplate-3s9t.onrender.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsiZGF0YSI6NDE4LCJwdXIiOiJibG9iX2lkIn19--9a141615722edd29d57287475d680c9266bfe529/eyJfcmFpbHMiOnsiZGF0YSI6eyJmb3JtYXQiOiJwbmciLCJyZXNpemVfdG9fbGltaXQiOls1MDAsNTAwXX0sInB1ciI6InZhcmlhdGlvbiJ9fQ==--11de9828f30c5f5a50ad1b716465b606e8b4c694/detail2.png"
},
{
"id": 279,
"color": "Red",
"price": 204.0,
"original_price": 290.0,
"sku": "SKU70-C",
"stock": 10,
"sizes":["36", "37", "38", "39", "40", "41", "42", "43", "44", "45"],
"product_id": 70,
"created_at": "2025-07-01T16:52:09.082Z",
"updated_at": "2025-07-01T16:52:14.197Z",
"images":[
"https://ruby-rails-boilerplate-3s9t.onrender.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsiZGF0YSI6NTIsInB1ciI6ImJsb2JfaWQifX0=--994a0cf714ea333b8aa201b1a9de12fbeb49a6b8/eyJfcmFpbHMiOnsiZGF0YSI6eyJmb3JtYXQiOiJwbmciLCJyZXNpemVfdG9fbGltaXQiOls1MDAsNTAwXX0sInB1ciI6InZhcmlhdGlvbiJ9fQ==--11de9828f30c5f5a50ad1b716465b606e8b4c694/detail2.png"
],
"avatar_url": "https://ruby-rails-boilerplate-3s9t.onrender.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsiZGF0YSI6NDE5LCJwdXIiOiJibG9iX2lkIn19--9565d9b7310b4a28862020f2cdbd4dc615486079/eyJfcmFpbHMiOnsiZGF0YSI6eyJmb3JtYXQiOiJwbmciLCJyZXNpemVfdG9fbGltaXQiOls1MDAsNTAwXX0sInB1ciI6InZhcmlhdGlvbiJ9fQ==--11de9828f30c5f5a50ad1b716465b606e8b4c694/detail3.png"
},
{
"id": 280,
"color": "Blue",
"price": 28.0,
"original_price": 257.0,
"sku": "SKU70-D",
"stock": 10,
"sizes":["36", "37", "38", "39", "40", "41", "42", "43", "44", "45"],
"product_id": 70,
"created_at": "2025-07-01T16:52:21.551Z",
"updated_at": "2025-07-01T16:52:26.632Z",
"images":[
"https://ruby-rails-boilerplate-3s9t.onrender.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsiZGF0YSI6NTMsInB1ciI6ImJsb2JfaWQifX0=--6e0fc29a0cf962d3d3a77f491ba7a768b93cbf46/eyJfcmFpbHMiOnsiZGF0YSI6eyJmb3JtYXQiOiJwbmciLCJyZXNpemVfdG9fbGltaXQiOls1MDAsNTAwXX0sInB1ciI6InZhcmlhdGlvbiJ9fQ==--11de9828f30c5f5a50ad1b716465b606e8b4c694/detail3.png"
],
"avatar_url": "https://ruby-rails-boilerplate-3s9t.onrender.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsiZGF0YSI6NDIwLCJwdXIiOiJibG9iX2lkIn19--ee70694b2d0b6ab0ed89193886f6e749db8c7e71/eyJfcmFpbHMiOnsiZGF0YSI6eyJmb3JtYXQiOiJwbmciLCJyZXNpemVfdG9fbGltaXQiOls1MDAsNTAwXX0sInB1ciI6InZhcmlhdGlvbiJ9fQ==--11de9828f30c5f5a50ad1b716465b606e8b4c694/detail4.png"
}
],
"image_url": "https://ruby-rails-boilerplate-3s9t.onrender.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsiZGF0YSI6NDE3LCJwdXIiOiJibG9iX2lkIn19--4c08658f4191e1054bc311fa7944aa3ef375f071/eyJfcmFpbHMiOnsiZGF0YSI6eyJmb3JtYXQiOiJwbmciLCJyZXNpemVfdG9fbGltaXQiOls1MDAsNTAwXX0sInB1ciI6InZhcmlhdGlvbiJ9fQ==--11de9828f30c5f5a50ad1b716465b606e8b4c694/detail1.png"
}
]

export const filterCategories = [
  { id: "soccer-shoes", name: "Soccer Shoes", active: true },
  { id: "soccer-cleats", name: "Soccer Cleats", active: false },
  { id: "f50", name: "F50", active: false },
  { id: "predator", name: "Predator", active: false },
  { id: "copa", name: "Copa", active: false },
  { id: "advanced-level", name: "Advanced Level", active: false },
  { id: "intermediate-level", name: "Intermediate Level", active: false },
  { id: "beginner-level", name: "Beginner Level", active: false },
]
