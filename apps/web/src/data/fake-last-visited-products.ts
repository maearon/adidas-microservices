// /data/fake-last-visited-products.ts
// ✅ Fake last visited data
import { LastVisitedProduct } from "@/types/product"

function slugify(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD") // loại bỏ dấu tiếng Việt
    .replace(/[\u0300-\u036f]/g, "") // xoá dấu (unicode accents)
    .replace(/[^a-z0-9\s-]/g, "") // loại bỏ ký tự đặc biệt
    .trim()
    .replace(/\s+/g, "-") // thay khoảng trắng bằng dấu gạch ngang
    .replace(/-+/g, "-") // loại bỏ nhiều dấu gạch liền nhau
}

function generateUrl(name: string, modelNumber: string) {
  return `/${slugify(name)}/${modelNumber}.html`
}

export const fakeLastVisitedProducts: LastVisitedProduct[] = [
  {
    product: {
      id: "1",
      display_name: "Soft Lux Mesh Full-Zip Hoodie",
      name: "Soft Lux Mesh Full-Zip Hoodie",
      price: "70",
      compare_at_price: "90",
      variant_code: "VC93-BL-b8e2",
      sport: "Sportswear",
      attribute_list: {
        brand: "Sportswear"
      },
      price_information: [
        {
          value: 70,
          value_no_vat: 70,
          type: "original"
        }
      ],
      pricing_information: { 
        currentPrice: 70, 
        standard_price: 70, 
        standard_price_no_vat: 70, 
      },
      thumbnail: "/images/Soft_Lux_Mesh_Full-Zip_Hoodie_Beige_JV9858_000_plp_model.jpg",
      image_url: "/images/Soft_Lux_Mesh_Full-Zip_Hoodie_Beige_JV9858_000_plp_model.jpg",
      image: "/images/Soft_Lux_Mesh_Full-Zip_Hoodie_Beige_JV9858_000_plp_model.jpg",
      model_number: "JV9858",
      base_model_number: "JV9858",
      product_type: "inline",
      url: generateUrl("Soft Lux Mesh Full-Zip Hoodie", "JV9858"),
    },
    timestamp: Date.now(),
    url: "/soft-lux-mesh-full-zip-hoodie/JV9858.html",
  },
  {
    product: {
      id: "2",
      display_name: "adicolor Firebird Oversized Track Pants",
      name: "adicolor Firebird Oversized Track Pants",
      price: "80",
      compare_at_price: "90",
      variant_code: "VC93-BL-b8e2",
      sport: "Originals",
      attribute_list: {
        brand: "Originals"
      },
      price_information: [
        {
          value: 80,
          value_no_vat: 80,
          type: "original"
        }
      ],
      pricing_information: { 
        currentPrice: 80, 
        standard_price: 80, 
        standard_price_no_vat: 80, 
      },
      thumbnail: "/images/adicolor_Firebird_Oversized_Track_Pants_Blue_JV7492_000_plp_model.jpg",
      image_url: "/images/adicolor_Firebird_Oversized_Track_Pants_Blue_JV7492_000_plp_model.jpg",
      image: "/images/adicolor_Firebird_Oversized_Track_Pants_Blue_JV7492_000_plp_model.jpg",
      model_number: "JV7492",
      base_model_number: "JV7492",
      product_type: "inline",
      url: generateUrl("adicolor Firebird Oversized Track Pants", "JV7492"),
    },
    timestamp: Date.now() - 10000,
    url: generateUrl("adicolor Firebird Oversized Track Pants", "JV7492"),
  },
  {
    product: {
      id: "3",
      display_name: "adicolor Teamgeist Cropped Track Top Blue",
      name: "adicolor Teamgeist Cropped Track Top Blue",
      price: "70",
      compare_at_price: "90",
      variant_code: "VC93-BL-b8e2",
      sport: "Originals",
      attribute_list: {
        brand: "Originals"
      },
      price_information: [
        {
          value: 70,
          value_no_vat: 70,
          type: "original"
        }
      ],
      pricing_information: { 
        currentPrice: 70, 
        standard_price: 70, 
        standard_price_no_vat: 70, 
      },
      thumbnail: "/images/Teamgeist_Adicolor_Cropped_Track_Top_Blue_JZ8277_000_plp_model.jpg",
      image_url: "/images/Teamgeist_Adicolor_Cropped_Track_Top_Blue_JZ8277_000_plp_model.jpg",
      image: "/images/Teamgeist_Adicolor_Cropped_Track_Top_Blue_JZ8277_000_plp_model.jpg",
      model_number: "JZ8277",
      base_model_number: "JZ8277",
      product_type: "inline",
      url: generateUrl("adicolor Teamgeist Cropped Track Top Blue", "JZ8277"),
    },
    timestamp: Date.now() - 20000,
    url: generateUrl("adicolor Teamgeist Cropped Track Top Blue", "JZ8277"),
  },
  {
    product: {
      id: "4",
      display_name: "Adifom Stan Smith Mule Shoes",
      name: "Adifom Stan Smith Mule Shoes",
      price: "70",
      compare_at_price: "90",
      variant_code: "VC93-BL-b8e2",
      sport: "Originals",
      attribute_list: {
        brand: "Originals"
      },
      price_information: [
        {
          value: 70,
          value_no_vat: 70,
          type: "original"
        }
      ],
      pricing_information: { 
        currentPrice: 70, 
        standard_price: 70, 
        standard_price_no_vat: 70, 
      },
      thumbnail: "/images/Adifom_Stan_Smith_Mule_Shoes_Blue_JR8820_00_plp_standard.jpg",
      image_url: "/images/Adifom_Stan_Smith_Mule_Shoes_Blue_JR8820_00_plp_standard.jpg",
      image: "/images/Adifom_Stan_Smith_Mule_Shoes_Blue_JR8820_00_plp_standard.jpg",
      model_number: "JR8820",
      base_model_number: "JR8820",
      product_type: "inline",
      url: generateUrl("Adifom Stan Smith Mule Shoes", "JR8820"),
    },
    timestamp: Date.now() - 30000,
    url: generateUrl("Adifom Stan Smith Mule Shoes", "JR8820"),
  },
  {
    product: {
      id: "5",
      display_name: "Soft Lux Mesh Tee",
      name: "Soft Lux Mesh Tee",
      price: "35",
      compare_at_price: "90",
      variant_code: "VC93-BL-b8e2",
      sport: "Originals",
      attribute_list: {
        brand: "Originals"
      },
      price_information: [
        {
          value: 35,
          value_no_vat: 35,
          type: "original"
        }
      ],
      pricing_information: { 
        currentPrice: 35, 
        standard_price: 35, 
        standard_price_no_vat: 35, 
      },
      thumbnail: "/images/Soft_Lux_Mesh_Tee_Beige_JV9873_000_plp_model.jpg",
      image_url: "/images/Soft_Lux_Mesh_Tee_Beige_JV9873_000_plp_model.jpg",
      image: "/images/Soft_Lux_Mesh_Tee_Beige_JV9873_000_plp_model.jpg",
      model_number: "JV9873",
      base_model_number: "JV9873",
      product_type: "inline",
      url: generateUrl("Soft Lux Mesh Tee", "JV9873"),
    },
    timestamp: Date.now() - 40000,
    url: generateUrl("Soft Lux Mesh Tee", "JV9873"),
  },
  {
    product: {
      id: "6",
      display_name: "Superstar 82 Roller Skates",
      name: "Superstar 82 Roller Skates",
      price: "200",
      compare_at_price: "90",
      variant_code: "VC93-BL-b8e2",
      sport: "Originals",
      attribute_list: {
        brand: "Originals"
      },
      price_information: [
        {
          value: 200,
          value_no_vat: 200,
          type: "original"
        }
      ],
      pricing_information: { 
        currentPrice: 200, 
        standard_price: 200, 
        standard_price_no_vat: 200, 
      },
      thumbnail: "/images/Superstar_82_Roller_Skates_Black_JI3535_00_plp_standard.jpg",
      image_url: "/images/Superstar_82_Roller_Skates_Black_JI3535_00_plp_standard.jpg",
      image: "/images/Superstar_82_Roller_Skates_Black_JI3535_00_plp_standard.jpg",
      model_number: "JI3535",
      base_model_number: "JI3535",
      product_type: "inline",
      url: generateUrl("Superstar 82 Roller Skates", "JI3535"),
    },
    timestamp: Date.now() - 40000,
    url: generateUrl("Superstar 82 Roller Skates", "JI3535"),
  },
  {
    product: {
      id: "7",
      display_name: "Tiro Cut 3-Stripes Soft Mesh Long Dress",
      name: "Tiro Cut 3-Stripes Soft Mesh Long Dress",
      price: "60",
      compare_at_price: "90",
      variant_code: "VC93-BL-b8e2",
      sport: "Originals",
      attribute_list: {
        brand: "Originals"
      },
      price_information: [
        {
          value: 60,
          value_no_vat: 60,
          type: "original"
        }
      ],
      pricing_information: { 
        currentPrice: 60, 
        standard_price: 60, 
        standard_price_no_vat: 60, 
      },
      thumbnail: "/images/Tiro_Cut_3-Stripes_Soft_Mesh_Long_Dress_Burgundy_JX5160_000_plp_model.jpg",
      image_url: "/images/Tiro_Cut_3-Stripes_Soft_Mesh_Long_Dress_Burgundy_JX5160_000_plp_model.jpg",
      image: "/images/Tiro_Cut_3-Stripes_Soft_Mesh_Long_Dress_Burgundy_JX5160_000_plp_model.jpg",
      model_number: "JX5160",
      base_model_number: "JX5160",
      product_type: "inline",
      url: generateUrl("Tiro Cut 3-Stripes Soft Mesh Long Dress", "JX5160"),
    },
    timestamp: Date.now() - 40000,
    url: generateUrl("Tiro Cut 3-Stripes Soft Mesh Long Dress", "JX5160"),
  },
  {
    product: {
      id: "8",
      display_name: "adidas Originals X Minecraft Jersey Kids",
      name: "adidas Originals X Minecraft Jersey Kids",
      price: "40",
      compare_at_price: "90",
      variant_code: "VC93-BL-b8e2",
      sport: "Originals",
      attribute_list: {
        brand: "Originals"
      },
      price_information: [
        {
          value: 40,
          value_no_vat: 40,
          type: "original"
        }
      ],
      pricing_information: { 
        currentPrice: 40, 
        standard_price: 40, 
        standard_price_no_vat: 40, 
      },
      thumbnail: "/images/adidas_Originals_X_Minecraft_Jersey_Kids_Multicolor_KD9839_000_plp_model.jpg",
      image_url: "/images/adidas_Originals_X_Minecraft_Jersey_Kids_Multicolor_KD9839_000_plp_model.jpg",
      image: "/images/adidas_Originals_X_Minecraft_Jersey_Kids_Multicolor_KD9839_000_plp_model.jpg",
      model_number: "KD9839",
      base_model_number: "KD9839",
      product_type: "inline",
      url: generateUrl("adidas Originals X Minecraft Jersey Kids", "KD9839"),
    },
    timestamp: Date.now() - 40000,
    url: generateUrl("adidas Originals X Minecraft Jersey Kids", "KD9839"),
  },
  {
    product: {
      id: "9",
      display_name: "Samba OG X Liberty London Shoes",
      name: "Samba OG X Liberty London Shoes",
      price: "105",
      compare_at_price: "90",
      variant_code: "VC93-BL-b8e2",
      sport: "Originals",
      attribute_list: {
        brand: "Originals"
      },
      price_information: [
        {
          value: 105,
          value_no_vat: 105,
          type: "original"
        }
      ],
      pricing_information: { 
        currentPrice: 105, 
        standard_price: 105, 
        standard_price_no_vat: 105, 
      },
      thumbnail: "/images/Samba_OG_X_Liberty_London_Shoes_White_JR8841_00_plp_standard.jpg",
      image_url: "/images/Samba_OG_X_Liberty_London_Shoes_White_JR8841_00_plp_standard.jpg",
      image: "/images/Samba_OG_X_Liberty_London_Shoes_White_JR8841_00_plp_standard.jpg",
      model_number: "JR8841",
      base_model_number: "JR8841",
      product_type: "inline",
      url: generateUrl("Samba OG X Liberty London Shoes", "JR8841"),
    },
    timestamp: Date.now() - 40000,
    url: generateUrl("Samba OG X Liberty London Shoes", "JR8841"),
  },
  {
    product: {
      id: "10",
      display_name: "Samba OG Shoes",
      name: "Samba OG Shoes",
      price: "100",
      compare_at_price: "90",
      variant_code: "VC93-BL-b8e2",
      sport: "Originals",
      attribute_list: {
        brand: "Originals"
      },
      price_information: [
        {
          value: 100,
          value_no_vat: 100,
          type: "original"
        }
      ],
      pricing_information: { 
        currentPrice: 100, 
        standard_price: 100, 
        standard_price_no_vat: 100, 
      },
      thumbnail: "/images/Samba_OG_Shoes_White_JS1391_00_plp_standard.jpg",
      image_url: "/images/Samba_OG_Shoes_White_JS1391_00_plp_standard.jpg",
      image: "/images/Samba_OG_Shoes_White_JS1391_00_plp_standard.jpg",
      model_number: "JS1391",
      base_model_number: "JS1391",
      product_type: "inline",
      url: generateUrl("Samba OG Shoes", "JS1391"),
    },
    timestamp: Date.now() - 40000,
    url: generateUrl("Samba OG Shoes", "JS1391"),
  },
];
