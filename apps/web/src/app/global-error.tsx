"use client";

/**
 * Root-level error UI must be self-contained (own html/body) and cannot rely on the root layout.
 * Keep this file free of Redux, next-intl-style hooks, or other providers from layout.tsx.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui", padding: "2rem", maxWidth: "32rem", margin: "0 auto" }}>
        <h1 style={{ fontSize: "1.25rem", fontWeight: 600 }}>Something went wrong</h1>
        <p style={{ color: "#666", marginTop: "0.5rem" }}>
          {process.env.NODE_ENV === "development" ? error.message : "An unexpected error occurred."}
        </p>
        <button
          type="button"
          onClick={() => reset()}
          style={{
            marginTop: "1.5rem",
            padding: "0.5rem 1rem",
            cursor: "pointer",
            border: "1px solid #ccc",
            borderRadius: "4px",
            background: "#111",
            color: "#fff",
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
