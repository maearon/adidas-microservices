// Định dạng chuẩn BCP 47: "en_US", "vi_VN", ...
export type SupportedLocale = 
"en_US"
// | "en_UK" 
| "vi_VN";

export const localeDisplayMap: Record<SupportedLocale, string> = {
  "en_US": "English (US)",
  // "en_UK": "English (UK)",
  "vi_VN": "Tiếng Việt",
};

export const countryDisplayMap: Record<string, string> = {
  "en_US": "United States",
  "en_UK": "United Kingdom",
  "vi_VN": "Việt Nam",
};

export const countryToLocaleMap: Record<string, SupportedLocale> = {
  "united-states": "en_US",
  // "united-kingdom": "en_UK",
  "vietnam": "vi_VN",
};

export interface LocaleOption {
  label: string;
  value: SupportedLocale;
  flagShow: string;
  flag: string;
}

export const localeOptions: LocaleOption[] = [
  {
    label: "English (US)",
    value: "en_US",
    flagShow: "/flag/us-show.svg",
    flag: "/flag/us.svg",
  },
  {
    label: "Tiếng Việt",
    value: "vi_VN",
    flagShow: "/flag/vn-show.svg",
    flag: "/flag/vn.svg",
  },
];
