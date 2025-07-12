import type { ErrorMessageType } from "@/components/shared/errorMessages"

export function handleApiError(error: any): ErrorMessageType {
  const res = error.response?.data
  const status = error._status || error.response?.status || 500

  const fieldErrors: ErrorMessageType = {}

  // ✅ Lỗi 422: validation
  if (status === 422 && Array.isArray(res?.errors)) {
    res.errors.forEach((err: any) => {
      const field = err?.cause?.field || "general"
      const message = err.defaultMessage || "Invalid input"
      if (!fieldErrors[field]) fieldErrors[field] = []
      fieldErrors[field].push(message)
    })
    return fieldErrors
  }

  // 🔐 401/403
  if (status === 401) return { general: ["Unauthorized. Please login again."] }
  if (status === 403) return { general: ["You do not have permission to perform this action."] }

  // 💥 Server error
  if (status === 500) return { general: ["Server error. Please try again later."] }

  // 📩 Message trả về từ server
  if (res?.message) return { general: [res.message] }

  // ❌ Không có response: có thể là mạng
  if (!error.response) {
    return { general: ["Cannot connect to the server. Please try again later."] }
  }

  return { general: ["Something went wrong. Please try again."] }
}
