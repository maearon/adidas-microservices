"use client";

import { NextPage } from "next";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";
import javaService from "@/api/services/javaService";
import flashMessage from "@/components/shared/flashMessages";
import ShowErrors, { ErrorMessageType } from "@/components/shared/errorMessages";
import { Loader2 } from "lucide-react";

const New: NextPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<ErrorMessageType>({});
  const submitRef = useRef<HTMLInputElement>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await javaService.resendActivationEmail({
        resend_activation_email: { email },
      });

      submitRef.current?.blur();
      setErrors({});
      flashMessage("success", "The activation email has been sent again. Please check your email.");
    } catch (err: any) {
      const status = err.response?.status;
      const message = err.response?.data || "An error occurred";

      if (status === 404) {
        flashMessage("error", "User not found");
      } else if (status === 422) {
        flashMessage("info", "Account already activated");
      } else {
        flashMessage("error", message.toString());
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-gray-50">
      <div className="bg-white w-full max-w-md shadow-xl rounded-xl p-8 border border-gray-200">
        <h1 className="text-2xl font-extrabold text-gray-900 mb-6 text-center uppercase tracking-wide">
          Resend Activation Email
        </h1>

        {Object.keys(errors).length > 0 && <ShowErrors errorMessage={errors} />}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="user_email" className="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <input
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:ring-black focus:border-black"
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
              className={`w-full flex justify-center items-center px-4 py-2 text-white font-semibold bg-black rounded-md shadow-sm hover:bg-gray-800 transition ${
                submitting ? "opacity-70 cursor-not-allowed" : ""
              }`}
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
