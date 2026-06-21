import * as Yup from "yup"
import type { AuthTranslations } from "@/types/auth"

export const emailValidationSchema = (t: AuthTranslations) =>
  Yup.object({
    email: Yup.string()
      .email(t?.validation?.emailInvalid || "Please enter a valid e-mail address")
      .required(t?.validation?.emailRequired || "Please enter a value"),
  })

export const passwordValidationSchema = (t: AuthTranslations) =>
  Yup.string()
    .required(t?.validation?.required || "Required")
    .min(8, t?.validation?.min8Characters || "Min 8 characters")
    .matches(/[A-Z]/, t?.validation?.oneUppercase || "1 uppercase")
    .matches(/[a-z]/, t?.validation?.oneLowercase || "1 lowercase")
    .matches(/[0-9]/, t?.validation?.oneNumber || "1 number")
    .matches(/[@$!%*?&#]/, t?.validation?.oneSpecialCharacter || "1 special character")
