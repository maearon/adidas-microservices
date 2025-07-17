// Định dạng chuẩn BCP 47: "en-US", "vi-VN", ...
export type SupportedLocale = "en-US"| "en-UK" | "vi-VN";

export const localeDisplayMap: Record<SupportedLocale, string> = {
  "en-US": "English (US)",
  "en-UK": "English (UK)",
  "vi-VN": "Tiếng Việt",
};

export const countryDisplayMap: Record<string, string> = {
  "en-US": "United States",
  "en-UK": "United Kingdom",
  "vi-VN": "Việt Nam",
};

export const countryToLocaleMap: Record<string, SupportedLocale> = {
  "united-states": "en-US",
  "united-kingdom": "en-UK",
  "vietnam": "vi-VN",
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
    value: "en-US",
    flagShow: "/flag/us-show.svg",
    flag: "/flag/us.svg",
  },
  {
    label: "Tiếng Việt",
    value: "vi-VN",
    flagShow: "/flag/vn-show.svg",
    flag: "/flag/vn.svg",
  },
];
