export const POST_LOGOUT_PATH = "/account-login"

export const OPEN_LOGIN_MODAL_EVENT = "adidas:open-login-modal"

export function openLoginModal() {
  if (typeof window === "undefined") return
  window.dispatchEvent(new CustomEvent(OPEN_LOGIN_MODAL_EVENT))
}
