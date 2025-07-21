import { Package, Truck, CheckCircle, Clock } from "lucide-react"
import { formatPrice } from "@/lib/utils"
import Breadcrumbs from "@/components/ui/Breadcrumbs"

interface OrderPageProps {
  params: { id: string }
}

export default function OrderPage({ params }: OrderPageProps) {
  const orderId = params.id

  // Mock order data - in a real app, this would come from an API
  const order = {
    id: orderId,
    status: "processing",
    date: "2024-01-15",
    total: 4250000,
    shipping: 0,
    items: [
      {
        id: "1",
        name: "Ultraboost 22",
        size: "42",
        color: "Đen",
        quantity: 1,
        price: 4200000,
        image: "/placeholder.png?height=100&width=100",
      },
    ],
    shippingAddress: {
      name: "Nguyễn Văn A",
      phone: "0901234567",
      address: "123 Đường ABC, Phường XYZ, Quận 1, TP.HCM",
    },
    timeline: [
      {
        status: "confirmed",
        title: "Đơn hàng đã được xác nhận",
        date: "2024-01-15 10:30",
        completed: true,
      },
      {
        status: "processing",
        title: "Đang chuẩn bị hàng",
        date: "2024-01-15 14:00",
        completed: true,
      },
      {
        status: "shipped",
        title: "Đã giao cho đơn vị vận chuyển",
        date: "",
        completed: false,
      },
      {
        status: "delivered",
        title: "Đã giao hàng",
        date: "",
        completed: false,
      },
    ],
  }

  const breadcrumbs = [
    { label: "Trang chủ", href: "/" },
    { label: "Tài khoản", href: "/account" },
    { label: "Đơn hàng", href: "/account/orders" },
    { label: `#${orderId}`, href: `/orders/${orderId}` },
  ]

  const getStatusIcon = (status: string, completed: boolean) => {
    if (completed) {
      return <CheckCircle className="h-5 w-5 text-green-600" />
    }

    switch (status) {
      case "processing":
        return <Package className="h-5 w-5 text-blue-600" />
      case "shipped":
        return <Truck className="h-5 w-5 text-blue-600" />
      default:
        return <Clock className="h-5 w-5 text-gray-400" />
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs items={breadcrumbs} />

      <div className="mt-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold">Đơn hàng #{orderId}</h1>
            <p className="text-gray-600 mt-1">Đặt ngày {order.date}</p>
          </div>
          <div className="mt-4 md:mt-0">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              Đang xử lý
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Timeline */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold mb-6">Trạng thái đơn hàng</h2>
            <div className="space-y-6">
              {order.timeline.map((step, index) => (
                <div key={step.status} className="flex items-start gap-4">
                  <div className="shrink-0">{getStatusIcon(step.status, step.completed)}</div>
                  <div className="flex-1">
                    <h3 className={`font-medium ${step.completed ? "text-green-600" : "text-gray-900"}`}>
                      {step.title}
                    </h3>
                    {step.date && <p className="text-sm text-gray-600 mt-1">{step.date}</p>}
                  </div>
                </div>
              ))}
            </div>

            {/* Order Items */}
            <div className="mt-12">
              <h2 className="text-xl font-bold mb-6">Sản phẩm đã đặt</h2>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div
                    key={`${item.id}-${item.size}-${item.color}`}
                    className="flex items-center gap-4 p-4 border rounded-lg"
                  >
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md">
                      <img
                        src={item.image || "/placeholder.png"}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-gray-600">
                        Kích cỡ: {item.size} | Màu: {item.color} | Số lượng: {item.quantity}
                      </p>
                    </div>
                    <div className="font-bold">{formatPrice(item.price)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary & Shipping */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="border rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">Tóm tắt đơn hàng</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Tạm tính</span>
                  <span>{formatPrice(order.total - order.shipping)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Phí vận chuyển</span>
                  <span>{order.shipping === 0 ? "Miễn phí" : formatPrice(order.shipping)}</span>
                </div>
                <hr />
                <div className="flex justify-between text-lg font-bold">
                  <span>Tổng cộng</span>
                  <span>{formatPrice(order.total)}</span>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="border rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">Địa chỉ giao hàng</h2>
              <div className="text-sm">
                <p className="font-medium">{order.shippingAddress.name}</p>
                <p className="text-gray-600">{order.shippingAddress.phone}</p>
                <p className="text-gray-600 mt-2">{order.shippingAddress.address}</p>
              </div>
            </div>

            {/* Support */}
            <div className="border rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">Cần hỗ trợ?</h2>
              <div className="space-y-2 text-sm">
                <p>
                  <a href="/contact" className="text-blue-600 hover:underline">
                    Liên hệ hỗ trợ khách hàng
                  </a>
                </p>
                <p>
                  <a href="/returns" className="text-blue-600 hover:underline">
                    Chính sách đổi trả
                  </a>
                </p>
                <p>
                  <a href="/shipping" className="text-blue-600 hover:underline">
                    Thông tin vận chuyển
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
