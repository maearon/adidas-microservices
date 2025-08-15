import { Product } from "@/types/product"

export const soccerShoesData: Product[] = [
  {
    id: 9,
    model_number: "VC93-BL-b8e2",
    title: "F50 Messi Elite Firm Ground Cleats",
    name: "F50 Messi Elite Firm Ground Cleats",
    description: "Experience comfort and performance with the new Adidas TankTop 9.",
    description_h5: "Premium TankTop for Soccer",
    specifications: "High-performance fabric, ergonomic design, moisture-wicking",
    care: "Machine wash cold. Tumble dry low.",
    gender: "Men",
    franchise: "Tubular",
    product_type: "Cleats",
    brand: "Adidas",
    category: "Shoes",
    sport: "Soccer",
    currencyId: "USD",
    currencyFormat: "$",
    isFreeShipping: true,
    availableSizes: ["36", "37", "38", "39", "40", "41", "42", "43", "44", "45"],
    price: 220.0,
    compare_at_price: 291.0, // ✅ thay cho original_price
    installments: 10,
    created_at: "2025-07-01T16:13:09.862Z",
    updated_at: "2025-07-01T16:13:09.862Z",
    collection: "F50 Collection",
    badge: "Best Seller",
    slug: "f50-messi-elite-firm-ground-cleats",
    reviews_count: 125,
    average_rating: 4.8,
    image_url: "https://ruby-rails-boilerplate-3s9t.onrender.com/rails/active_storage/representations/redirect/detail1.png",
    variants: [
      {
        id: 33,
        color: "Black",
        price: 220.0,
        compare_at_price: 291.0,
        sku: "SKU9-A",
        stock: 10,
        sizes: ["36","37","38","39","40","41","42","43","44","45"],
        product_id: 9,
        created_at: "2025-07-01T16:13:10.356Z",
        updated_at: "2025-07-01T16:13:20.101Z",
        images: ["https://ruby-rails-boilerplate-3s9t.onrender.com/rails/active_storage/representations/redirect/detail1.png"],
        avatar_url: "https://ruby-rails-boilerplate-3s9t.onrender.com/rails/active_storage/representations/redirect/detail1.png"
      },
      {
        id: 34,
        color: "White",
        price: 219.0,
        compare_at_price: 276.0,
        sku: "SKU9-B",
        stock: 10,
        sizes: ["36","37","38","39","40","41","42","43","44","45"],
        product_id: 9,
        created_at: "2025-07-01T16:13:26.400Z",
        updated_at: "2025-07-01T16:13:31.556Z",
        images: ["https://ruby-rails-boilerplate-3s9t.onrender.com/rails/active_storage/representations/redirect/detail2.png"],
        avatar_url: "https://ruby-rails-boilerplate-3s9t.onrender.com/rails/active_storage/representations/redirect/detail2.png"
      },
      {
        id: 35,
        color: "Red",
        price: 155.0,
        compare_at_price: 293.0,
        sku: "SKU9-C",
        stock: 10,
        sizes: ["36","37","38","39","40","41","42","43","44","45"],
        product_id: 9,
        created_at: "2025-07-01T16:13:39.085Z",
        updated_at: "2025-07-01T16:13:44.948Z",
        images: ["https://ruby-rails-boilerplate-3s9t.onrender.com/rails/active_storage/representations/redirect/detail3.png"],
        avatar_url: "https://ruby-rails-boilerplate-3s9t.onrender.com/rails/active_storage/representations/redirect/detail3.png"
      },
      {
        id: 36,
        color: "Blue",
        price: 214.0,
        compare_at_price: 260.0,
        sku: "SKU9-D",
        stock: 10,
        sizes: ["36","37","38","39","40","41","42","43","44","45"],
        product_id: 9,
        created_at: "2025-07-01T16:13:52.066Z",
        updated_at: "2025-07-01T16:13:57.450Z",
        images: ["https://ruby-rails-boilerplate-3s9t.onrender.com/rails/active_storage/representations/redirect/detail4.png"],
        avatar_url: "https://ruby-rails-boilerplate-3s9t.onrender.com/rails/active_storage/representations/redirect/detail4.png"
      }
    ]
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
  { id: "beginner-level", name: "Beginner Level", active: false }
]
