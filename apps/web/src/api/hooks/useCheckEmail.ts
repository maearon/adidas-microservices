import { useMutation } from "@tanstack/react-query"
import javaService from "@/api/services/javaService"

export const useCheckEmail = () =>
  useMutation({
    mutationKey: ['CheckEmail'],
    mutationFn: (email: string) => javaService.checkEmail(email),
  })
