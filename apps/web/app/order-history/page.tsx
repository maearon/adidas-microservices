"use client"

import javaService from "@/api/services/javaService"
import Link from "next/link"
import { useState, useEffect } from "react"

interface Order {
  id: number
  order_number: string
  status: string
  total: number
  created_at: string
  items: any[]
}

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await javaService.getOrders()
        setOrders(response)
      } catch (error) {
        console.error("Failed to fetch orders:", error)
        setOrders([]) // Set empty array on error
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  if (loading) {
    return (
      <div className="bg-white border rounded-lg p-8">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white border rounded-lg p-8">
      <h1 className="text-2xl font-bold mb-6">ORDER HISTORY</h1>

      {orders.length === 0 ? (
        <div className="text-center py-4">
          <div className="text-6xl mb-4">📦</div>
          <h2 className="text-xl font-bold mb-4">NO ORDERS YET</h2>
          <p className="text-gray-600 mb-6">Once you place an order, it will appear here.</p>
          <Link
            href="/"
            className="bg-black text-white px-8 py-3 font-bold hover:bg-gray-800 transition-colors inline-block"
          >
            START SHOPPING
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="border rounded-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold">Order #{order.order_number}</h3>
                  <p className="text-sm text-gray-600">Placed on {new Date(order.created_at).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">${order.total.toFixed(2)}</p>
                  <span
                    className={`inline-block px-2 py-1 text-xs rounded ${
                      order.status === "delivered"
                        ? "bg-green-100 text-green-800"
                        : order.status === "shipped"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {order.status.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Items ({order.items.length})</h4>
                  <div className="space-y-2">
                    {order.items.slice(0, 2).map((item, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          className="w-12 h-12 object-cover"
                        />
                        <div>
                          <p className="text-sm font-medium">{item.name}</p>
                          <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                        </div>
                      </div>
                    ))}
                    {order.items.length > 2 && (
                      <p className="text-sm text-gray-600">+{order.items.length - 2} more items</p>
                    )}
                  </div>
                </div>

                <div className="flex flex-col justify-between">
                  <div className="space-y-2">
                    <Link
                      href={`/order-tracker?order=${order.order_number}`}
                      className="text-black underline text-sm font-medium"
                    >
                      Track Order
                    </Link>
                    <Link href={`/my-account/orders/${order.id}`} className="text-black underline text-sm font-medium">
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
