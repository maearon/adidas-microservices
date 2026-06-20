/** Centralized stacking order — higher overlays sit above site header (z-40). */
export const Z = {
  siteHeader: 40,
  megaMenu: 45,
  headerDropdown: 50,
  topBarBackdrop: 200,
  topBarPanel: 210,
  mobileMenuBackdrop: 300,
  mobileMenu: 310,
  mobileSearchBackdrop: 315,
  mobileSearch: 320,
  feedbackTab: 350,
  feedbackBackdrop: 360,
  feedbackPanel: 370,
  accountBackdrop: 400,
  accountPanel: 410,
  fullScreenLoader: 9999,
} as const
