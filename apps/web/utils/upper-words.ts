export const upperWords = (str: string) => {
  return str.split(' ').map(w => w.toUpperCase()).join(' ')
}

export const capitalizeWords = (str: string) => {
  return str.split(' ').map(w => capitalize(w)).join(' ')
}

export const capitalizeWordsCountry = (str: string) => {
  return str.split('-').map(w => capitalize(w)).join(' ')
}

/**
 * Capitalize the first character
 */
function capitalize(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1)
}
