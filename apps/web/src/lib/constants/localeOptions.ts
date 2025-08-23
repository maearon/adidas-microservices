// src/lib/constants/localeOptions.ts

// Định dạng chuẩn BCP 47: "en_US", "vi_VN"
export type SupportedLocale = 
  | "en_US"
  | "vi_VN"
// | "en_UK"; // mở rộng sau nếu cần

// Hiển thị ngôn ngữ (map code → tên hiển thị)
export const localeDisplayMap: Record<SupportedLocale, string> = {
  en_US: "English (US)",
  vi_VN: "Tiếng Việt",
  // en_UK: "English (UK)",
};

// Hiển thị quốc gia (map code → tên quốc gia)
export const countryDisplayMap: Record<SupportedLocale, string> = {
  en_US: "United States",
  vi_VN: "Việt Nam",
  // en_UK: "United Kingdom",
};

// Map country slug → locale
export const countryToLocaleMap: Record<string, SupportedLocale> = {
  "united-states": "en_US",
  "viet-nam": "vi_VN",
  // "united-kingdom": "en_UK",
};

export interface LocaleOption {
  label: string;
  value: SupportedLocale;
  flagShow: string; // icon nhỏ cho menu
  flag: string;     // icon lớn, nếu cần
}

// Tạo danh sách option dựa trên localeDisplayMap
export const localeOptions: LocaleOption[] = [
  {
    label: localeDisplayMap.en_US,
    value: "en_US",
    flagShow: "/flag/us-show.svg",
    flag: "/flag/us.svg",
  },
  {
    label: localeDisplayMap.vi_VN,
    value: "vi_VN",
    flagShow: "/flag/vn-show.svg",
    flag: "/flag/vn.svg",
  },
];
