import { useMutation } from "@tanstack/react-query"
import { useDispatch } from "react-redux"
import { fetchUser } from "@/store/sessionSlice"
import type { AppDispatch } from "@/store/store"
import { setTokens } from "@/lib/token"
import javaService from "@/api/services/javaService"
import { useToast } from "@/components/ui/use-toast"
import { handleNetworkError } from "@/components/shared/handleNetworkError"

interface LoginPayload {
  email: string
  password: string
  keepLoggedIn?: boolean
}

export const useLoginMutation = () => {
  const { toast } = useToast()
  const dispatch = useDispatch<AppDispatch>()

  return useMutation({
    mutationKey: ["login"],
    mutationFn: async ({ email, password, keepLoggedIn = true }: LoginPayload) => {
      try {
        const response = await javaService.login({
          session: { email, password },
        })

        // ✅ Kiểm tra an toàn trước khi sử dụng
        if (!response?.tokens?.access?.token || !response?.tokens?.refresh?.token) {
          throw new Error("Invalid login response: missing tokens.")
        }

        const { access, refresh } = response.tokens
        setTokens(access.token, refresh.token, keepLoggedIn)

        return response
      } catch (error: any) {
        handleNetworkError(error)
        throw error
      }
    },
    onSuccess: async () => {
      try {
        await dispatch(fetchUser())
        toast({
          title: "Success",
          description: "Logged in successfully!",
        })
      } catch (err) {
        toast({
          variant: "default",
          title: "Logged in",
          description: "But failed to fetch user profile.",
        })
      }
    },
    onError: (error: any) => {
      const message = error?.response?.data?.error
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: message ? `Error: ${message}` : "Login failed. Please try again.",
      })
    },
  })
}
