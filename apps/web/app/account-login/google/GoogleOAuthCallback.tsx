"use client";
import { useEffect } from "react";
import flashMessage from "@/components/shared/flashMessages";

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET;
const GOOGLE_REDIRECT_URI = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI;

export default function GoogleOAuthCallback() {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (!code) {
      flashMessage("error", "Authorization code is missing from URL");
      return;
    }

    const params = new URLSearchParams();
    params.append("code", code);
    params.append("client_id", GOOGLE_CLIENT_ID || "");
    params.append("client_secret", GOOGLE_CLIENT_SECRET || "");
    params.append("redirect_uri", GOOGLE_REDIRECT_URI || "");
    params.append("grant_type", "authorization_code");

    fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.access_token) {
          localStorage.setItem("accessToken", data.access_token);
          flashMessage("success", "Google login successful!");
          window.location.href = "/";
        } else {
          flashMessage("error", "Failed to get access token");
        }
      })
      .catch(() => {
        flashMessage("error", "Error exchanging code for token");
      });
  }, []);

  return <p>Processing Google login...</p>;
}
