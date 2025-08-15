export const playSound = (file: string) => {
  const audio = new Audio(file)
  audio.play().catch((err) => console.error("🔇 Sound error:", err))
}
