import { MenuCategory } from "@/types/common"
import { capitalizeWords } from "@/utils/upper-words"

export const sanitizeMenuTitles = (menu: MenuCategory[]): MenuCategory[] => {
  return menu.map((section) => ({
    ...section,
    title: capitalizeTitle(section.title),
  }))
}

const lowercaseWords = ["by", "with", "of", "the", "and", "in", "on", "at", "to", "for", "from", "free", "delivery"]

export const capitalizeTitle = (str: string) => {
  const words = str.toLowerCase().split(" ")

  return words
    .map((word) => {
      return lowercaseWords.includes(word)
        ? word
        : capitalizeWords(word)
    })
    .join(" ")
}
