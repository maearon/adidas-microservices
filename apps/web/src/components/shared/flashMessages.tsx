import { toast } from "react-toastify"

type FlashType = "success" | "danger" | "warning" | "info" | "error"

const flashMessage = (message_type: FlashType, message: string) => {
  const mapper: Record<FlashType, (msg: string) => void> = {
    success: toast.success,
    danger: toast.error,
    warning: toast.warn,
    info: toast.info,
    error: toast.error,
  }

  mapper[message_type](message)
}

export default flashMessage
