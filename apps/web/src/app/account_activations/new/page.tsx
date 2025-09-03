"use client";

import { NextPage } from "next";
import React, { useRef, useState } from "react";
import javaService from "@/api/services/javaService";
import flashMessage from "@/components/shared/flashMessages";
import ShowErrors, { ErrorMessages } from "@/components/shared/errorMessages";
import { Loader2 } from "lucide-react";

const New: NextPage = () => {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<ErrorMessages>({});
  const submitRef = useRef<HTMLButtonElement>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await javaService.resendActivationEmail({
        resend_activation_email: { email },
      });

      submitRef.current?.blur();
      setErrors({});
      if (response?._status === 422) {
        flashMessage("info", String(response) || "Account already activated");
      } else if (response?._status === 200) {
        flashMessage("success", "The activation email has been sent again. Please check your email.");
      }
    } catch (err: unknown) {
      if (typeof err === "object" && err !== null && "response" in err) {
        const error = err as { response?: { status?: number; data?: unknown } };
        const status = error.response?.status;
        const message = error.response?.data || "An error occurred";

        if (status === 404) {
          flashMessage("error", "User not found");
        } else if (status === 422) {
          flashMessage("info", "Account already activated");
        } else {
          flashMessage("error", message?.toString() ?? "Unknown error");
        }
      } else {
        flashMessage("error", "Unexpected error");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 w-full max-w-md shadow-xl rounded-xl p-8 border border-gray-200 dark:border-gray-700">
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-6 text-center uppercase tracking-wide">
          Resend Activation Email
        </h1>

        {Object.keys(errors).length > 0 && <ShowErrors errorMessage={errors} />}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="user_email"
              className="block text-base font-medium text-gray-700 dark:text-gray-300"
            >
              Email address
            </label>
            <input
              className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-xs p-2 focus:ring-black focus:border-border"
              type="email"
              name="email"
              id="user_email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
            />
          </div>

          <div>
            <button
              ref={submitRef}
              type="submit"
              disabled={submitting}
              className={`w-full flex justify-center items-center px-4 py-2 font-semibold rounded-md shadow-xs transition 
                bg-black text-white hover:bg-gray-800 
                dark:bg-white dark:text-black dark:hover:bg-gray-200
                ${submitting ? "opacity-70 cursor-not-allowed" : ""}`}
            >
              {submitting && <Loader2 className="animate-spin mr-2 h-5 w-5" />}
              {submitting ? "Sending..." : "Resend Activation Email"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default New;
