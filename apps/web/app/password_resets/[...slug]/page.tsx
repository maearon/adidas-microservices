"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import javaService from "@/api/services/javaService";
import flashMessage from "@/components/shared/flashMessages";

const Edit = ({ params }: { params: { slug: string[] } }) => {
  const router = useRouter();
  const [state, setState] = useState({
    password: "",
    password_confirmation: "",
    errorMessage: [] as string[],
  });
  const submitRef = useRef<HTMLInputElement>(null);
  const reset_token = params.slug[0];
  const email = decodeURIComponent(params.slug[1]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const key = name.match(/\[(.*?)\]/)?.[1] || name;
    setState((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await javaService.resetForForgotPassword(reset_token, {
        email,
        user: {
          password: state.password,
          password_confirmation: state.password_confirmation,
        },
      });

      if (res.flash?.[0] === "success") {
        flashMessage("success", res.flash[1]);
        router.push("/login");
      } else if (res.flash?.[0] === "danger") {
        flashMessage("error", res.flash[1]);
      } else if (res.error) {
        flashMessage("error", res.error.join(", "));
      } else {
        flashMessage("info", "Something went wrong.");
      }
    } catch (error) {
      flashMessage("error", "Unable to reset password. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-gray-50">
      <div className="w-full max-w-md bg-white shadow-md rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-center mb-6">Reset your password</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="user_password" className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <input
              type="password"
              name="user[password]"
              id="user_password"
              value={state.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Enter new password"
            />
          </div>

          <div>
            <label htmlFor="user_password_confirmation" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              name="user[password_confirmation]"
              id="user_password_confirmation"
              value={state.password_confirmation}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Confirm password"
            />
          </div>

          <div>
            <input
              ref={submitRef}
              type="submit"
              value="Update Password"
              className="w-full bg-black text-white py-2 rounded-xl hover:bg-neutral-900 transition"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default Edit;
