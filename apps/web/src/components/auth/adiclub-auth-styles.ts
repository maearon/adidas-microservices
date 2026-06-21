import { cn } from "@/lib/utils"

export const authPageClass = "w-full bg-white text-foreground dark:bg-black"

export const authSectionClass = "w-full bg-white py-2 text-foreground dark:bg-black lg:py-10"

export const authHeadingClass =
  "text-[28px] font-bold uppercase leading-tight text-foreground"

export const authBodyClass = "text-base leading-relaxed text-foreground"

export const authMutedTextClass = "text-sm text-gray-600 dark:text-gray-300"

export const authSubtleTextClass = "text-sm leading-relaxed text-gray-700 dark:text-gray-300"

export const authDisclaimerClass =
  "mt-6 text-xs leading-relaxed text-gray-500 dark:text-gray-400"

const authInputBase =
  "h-12 w-full bg-transparent px-3 text-foreground placeholder:text-sm placeholder:font-normal placeholder:uppercase placeholder:tracking-wide placeholder:text-neutral-500 dark:placeholder:text-neutral-400"

export function authFieldInputClass(hasError: boolean, isValid: boolean) {
  return cn(
    authInputBase,
    hasError
      ? "border-red-500 border-b-2 focus:border-red-500 focus:ring-red-500"
      : isValid
        ? "border-green-600 focus:border-green-600 focus:ring-green-600 dark:border-green-500 dark:focus:border-green-500 dark:focus:ring-green-500"
        : "border-black focus:ring-black dark:border-white dark:focus:ring-white",
  )
}

export const authPasswordInputClass = cn(
  authInputBase,
  "border-black pr-20 focus:ring-black dark:border-white dark:focus:ring-white",
)
