"use client";

import { NextPage } from "next";
import { useRef, useState } from "react";
import javaService from "@/api/services/javaService";
import flashMessage from "@/components/shared/flashMessages";
import { Loader2 } from "lucide-react";

const ForgotPassword: NextPage = () => {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const submitRef = useRef<HTMLButtonElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await javaService.sendForgotPasswordEmail({
        password_reset: { email },
      });
      submitRef.current?.blur();
      flashMessage(
        "success",
        "The password reset email has been sent. Please check your inbox."
      );
    } catch (err: unknown) {
      flashMessage(
        "error",
        "Failed to send reset email. Please check your email address."
      );
      console.error("ForgotPassword error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 w-full max-w-md shadow-xl rounded-xl p-8 border border-gray-200 dark:border-gray-700">
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-3 text-center tracking-wide">
          Forgot your password?
        </h1>
        <p className="text-base text-gray-600 dark:text-gray-300 text-center mb-6">
          Enter your email and we’ll send you a link to reset your password.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="password_reset_email"
              className="block text-base font-medium text-gray-700 dark:text-gray-300"
            >
              Email address
            </label>
            <input
              type="email"
              id="password_reset_email"
              name="password_reset[email]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="you@example.com"
              className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 p-2 shadow-sm focus:ring-black focus:border-black"
            />
          </div>

          <div>
            <button
              ref={submitRef}
              type="submit"
              disabled={submitting}
              className={`w-full flex justify-center items-center px-4 py-2 font-semibold rounded-md shadow-sm transition 
                bg-black text-white hover:bg-gray-800 
                dark:bg-white dark:text-black dark:hover:bg-gray-200
                ${submitting ? "opacity-70 cursor-not-allowed" : ""}`}
            >
              {submitting && (
                <Loader2 className="animate-spin mr-2 h-5 w-5" />
              )}
              {submitting ? "Sending..." : "Send Reset Link"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
