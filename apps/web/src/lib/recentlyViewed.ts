// lib/recentlyViewed.ts
import { Product } from "@/types/product"

const STORAGE_KEY = "lastVisitedProducts"
const LIMIT = 10

// Kiểu dữ liệu lưu trong localStorage
export interface LastVisitedItem {
  product: Product
  visitedAt: number
}

/**
 * Lấy danh sách sản phẩm đã xem gần đây
 */
export function getLastVisited(): LastVisitedItem[] {
  if (typeof window === "undefined") return []

  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed as LastVisitedItem[]
  } catch {
    return []
  }
}

/**
 * Thêm 1 sản phẩm vào danh sách đã xem gần đây
 */
export function addLastVisited(product: Product) {
  if (typeof window === "undefined") return

  let list = getLastVisited()

  // Xóa sản phẩm trùng id (nếu đã tồn tại trong list)
  list = list.filter((p) => p.product.id !== product.id)

  // Push sản phẩm mới lên đầu danh sách
  list.unshift({
    product,
    visitedAt: Date.now(),
  })

  // Giới hạn số lượng
  if (list.length > LIMIT) {
    list = list.slice(0, LIMIT)
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
  } catch (err) {
    console.error("Lưu lastVisited thất bại:", err)
  }
}

/**
 * Xóa toàn bộ lịch sử sản phẩm đã xem
 */
export function clearLastVisited() {
  if (typeof window === "undefined") return
  localStorage.removeItem(STORAGE_KEY)
}
