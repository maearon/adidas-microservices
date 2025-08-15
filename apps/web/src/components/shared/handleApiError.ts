import type { ErrorMessageType } from "@/components/shared/errorMessages"

interface ValidationErrorItem {
  cause?: {
    field?: string
  }
  defaultMessage?: string
}

interface ErrorResponseData {
  _status?: number
  errors?: ValidationErrorItem[]
  message?: string
}

export function handleApiError(error: unknown): ErrorMessageType {
  const errObj = error as {
    data?: ErrorResponseData
    response?: {
      data?: ErrorResponseData
      status?: number
    }
    _status?: number
  }

  const res: ErrorResponseData = errObj?.data || errObj?.response?.data || {}
  const status = errObj?._status || res?._status || errObj?.response?.status || 500

  const fieldErrors: ErrorMessageType = {}

  // ✅ Lỗi 422: validation
  if (status === 422 && Array.isArray(res?.errors)) {
    res.errors.forEach((err) => {
      const field = err?.cause?.field || "general"
      const message = err?.defaultMessage || "Invalid input"
      if (!fieldErrors[field]) fieldErrors[field] = []
      fieldErrors[field].push(message)
    })
    return fieldErrors
  }

  // 🔐 401/403
  if (status === 401) return { general: ["Unauthorized. Please login again."] }
  if (status === 403) return { general: ["You do not have permission to perform this action."] }

  // 💥 500 - Server error
  if (status === 500) return { general: ["Server error. Please try again later."] }

  // 🚫 503 - Service unavailable / timeout
  if (status === 503) {
    return { general: ["Cannot connect to the server. Please try again later."] }
  }

  // 📩 Server trả về message rõ ràng
  if (res?.message) return { general: [res.message] }

  // ❌ Không có response: lỗi mạng
  if (!errObj?.response) {
    return { general: ["Cannot connect to the server. Please try again later."] }
  }

  // ❓ Fallback
  return { general: ["Something went wrong. Please try again."] }
}
