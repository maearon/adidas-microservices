let lockCount = 0
let savedOverflow = ""

export function lockBodyScroll() {
  if (typeof document === "undefined") return

  if (lockCount === 0) {
    savedOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
  }
  lockCount++
}

export function unlockBodyScroll() {
  if (typeof document === "undefined") return

  if (lockCount <= 0) {
    lockCount = 0
    return
  }

  lockCount--
  if (lockCount === 0) {
    document.body.style.overflow = savedOverflow
    savedOverflow = ""
  }
}

/** Safety net — call on route changes if a lock was leaked. */
export function resetBodyScrollLock() {
  if (typeof document === "undefined") return

  lockCount = 0
  savedOverflow = ""
  document.body.style.overflow = ""
}
