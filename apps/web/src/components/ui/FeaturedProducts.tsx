// "use client"

// import { useEffect, useState } from "react"
// import Link from "next/link"
// import { Button } from "@/components/ui/button"
// import ProductCard from "@/components/product/ProductCard"
// import { getFeaturedProducts, type Product } from "@/api/client"

// export default function FeaturedProducts() {
//   const [products, setProducts] = useState<Product[]>([])
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     const loadProducts = async () => {
//       try {
//         const data = await getFeaturedProducts()
//         setProducts(data.slice(0, 4))
//       } catch (error) {
//         console.error("Failed to load products:", error)
//       } finally {
//         setLoading(false)
//       }
//     }

//     loadProducts()
//   }, [])

//   if (loading) {
//     return (
//       <section className="py-16">
//         <div className="container mx-auto px-4">
//           <h2 className="text-3xl font-bold text-center mb-12">Sản phẩm nổi bật</h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//             {[...Array(4)].map((_, i) => (
//               <div key={i} className="animate-pulse">
//                 <div className="bg-gray-200 aspect-square rounded-lg mb-4"></div>
//                 <div className="h-4 bg-gray-200 rounded mb-2"></div>
//                 <div className="h-4 bg-gray-200 rounded w-2/3"></div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>
//     )
//   }

//   return (
//     <section className="py-16 bg-gray-50">
//       <div className="container mx-auto px-4">
//         <h2 className="text-3xl font-bold text-center mb-12">Sản phẩm nổi bật</h2>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
//           {products.map((product) => (
//             <ProductCard key={product.id} product={product} />
//           ))}
//         </div>

//         <div className="text-center">
//           <Link href="/products">
//             <Button size="lg">Xem tất cả sản phẩm</Button>
//           </Link>
//         </div>
//       </div>
//     </section>
//   )
// }
