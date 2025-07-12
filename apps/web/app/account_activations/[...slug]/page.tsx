"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import javaService from "@/api/services/javaService";
import flashMessage from "@/components/shared/flashMessages";
import { CheckCircle, Loader2, AlertTriangle } from "lucide-react"; // hoặc Radix icon nếu thích

export interface EditProps {
  params: {
    slug: string[];
  };
}

export default function Edit({ params }: EditProps) {
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  const activation_token = params.slug?.[0] || "";
  const email = params.slug?.[1] ? decodeURIComponent(params.slug[1]) : "";

  useEffect(() => {
    if (!activation_token || !email) {
      flashMessage("error", "Invalid activation link");
      setStatus("error");
      router.push("/");
      return;
    }

    javaService
      .activateAccount(activation_token, email)
      .then(() => {
        flashMessage("success", "The account has been activated. Please log in.");
        setStatus("success");
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      })
      .catch((error) => {
        console.error("Activation Error:", error);
        flashMessage("error", "Account activation failed. Please try again.");
        setStatus("error");
        router.push("/");
      });
  }, [activation_token, email, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="max-w-md text-center bg-white p-8 rounded-2xl shadow-xl space-y-4 border">
        {status === "loading" && (
          <>
            <Loader2 className="mx-auto h-12 w-12 text-gray-600 animate-spin" />
            <h2 className="text-xl font-semibold text-gray-700">Activating your account...</h2>
            <p className="text-sm text-gray-500">Please wait while we process your activation.</p>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
            <h2 className="text-xl font-semibold text-green-600">Account Activated</h2>
            <p className="text-sm text-gray-500">Redirecting to login page...</p>
          </>
        )}

        {status === "error" && (
          <>
            <AlertTriangle className="mx-auto h-12 w-12 text-red-500" />
            <h2 className="text-xl font-semibold text-red-600">Activation Failed</h2>
            <p className="text-sm text-gray-500">We couldn’t activate your account. Please try again later.</p>
          </>
        )}
      </div>
    </div>
  );
}
