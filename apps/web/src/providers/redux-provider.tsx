"use client";

import type React from "react";
import { useEffect } from "react";

import { Provider } from "react-redux";
import { localeOptions } from "@/lib/constants/localeOptions";
import { getLocaleFromClient } from "@/lib/locale.client";
import { store } from "@/store/store";
import { setLocale } from "@/store/localeSlice";
import type { SupportedLocale } from "@/lib/constants/localeOptions";
import CommerceSyncProvider from "@/components/commerce/CommerceSyncProvider";

type ReduxProviderProps = {
  children: React.ReactNode;
  initialLocale?: SupportedLocale;
};

function isSupportedLocale(value: string | undefined): value is SupportedLocale {
  return Boolean(
    value && localeOptions.some((option) => option.value === value),
  );
}

function syncLocaleFromClient() {
  const clientLocale = getLocaleFromClient() as SupportedLocale;
  if (localeOptions.some((option) => option.value === clientLocale)) {
    store.dispatch(setLocale(clientLocale));
  }
}

export function ReduxProvider({
  children,
  initialLocale,
}: ReduxProviderProps) {
  useEffect(() => {
    if (isSupportedLocale(initialLocale)) {
      store.dispatch(setLocale(initialLocale));
      return;
    }

    syncLocaleFromClient();
  }, [initialLocale]);

  return (
    <Provider store={store}>
      <CommerceSyncProvider>{children}</CommerceSyncProvider>
    </Provider>
  );
}
