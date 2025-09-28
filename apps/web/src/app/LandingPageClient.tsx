"use client";

import { ErrorBoundary } from "react-error-boundary";
import { Suspense, useEffect } from "react";
import { LandingPageContents } from "./_ui/landing-page-contents";

function ErrorFallback() {
  useEffect(() => {
    // 🧹 Xóa toàn bộ local/session storage
    localStorage.clear();
    sessionStorage.clear();

    // 🍪 Xóa tất cả cookies
    document.cookie.split(";").forEach((cookie) => {
      const name = cookie.split("=")[0].trim();
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
    });

    // 🔁 Redirect
    setTimeout(() => {
      window.location.href = "/";
    }, 50);
  }, []);

  return <div>There was an error. Redirecting...</div>;
}

export default function LandingPageClient() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Suspense fallback={<div>Loading...</div>}>
        <LandingPageContents />
      </Suspense>
    </ErrorBoundary>
  );
}
