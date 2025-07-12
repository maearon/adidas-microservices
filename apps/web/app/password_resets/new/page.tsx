"use client"

import { NextPage } from "next";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";
import javaService from "@/api/services/javaService";
import flashMessage from "@/components/shared/flashMessages";

const ForgotPassword: NextPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const submitRef = useRef<HTMLInputElement>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await javaService.sendForgotPasswordEmail({
        password_reset: { email },
      });
      submitRef.current?.blur();
      flashMessage("success", "The password reset email has been sent. Please check your inbox.");
      // router.push("/"); // Optional: redirect
    } catch (error: any) {
      flashMessage("error", "Failed to send reset email. Please check your email address.");
      console.error("ForgotPassword error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8">
        <h2 className="text-2xl font-bold text-center mb-6">Forgot your password?</h2>
        <p className="text-sm text-gray-600 text-center mb-6">
          Enter your email and we’ll send you a link to reset your password.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email address
            </label>
            <input
              type="email"
              name="password_reset[email]"
              id="password_reset_email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <input
              ref={submitRef}
              type="submit"
              value={submitting ? "Sending..." : "Send Reset Link"}
              disabled={submitting}
              className="w-full bg-black text-white py-2 rounded-xl hover:bg-neutral-900 transition"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
