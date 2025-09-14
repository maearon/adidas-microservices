// 📦 apps/web/lib/navigate.ts
export const redirectToLogin = () => {
  if (typeof window !== "undefined") {
    window.history.pushState({}, "", "/sign-in")  // ❌ vẫn reload
    // 👉 hoặc tốt hơn:
    window.dispatchEvent(new Event("customRedirectToLogin"))
  }
}
