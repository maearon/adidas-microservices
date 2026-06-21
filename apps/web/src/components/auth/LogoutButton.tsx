"use client";

import { authClient } from '@/lib/auth-client'
import { POST_LOGOUT_PATH } from '@/lib/auth-navigation'
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();
  const signout = async () => await authClient.signOut({
      fetchOptions: {
        onSuccess: () => router.push(POST_LOGOUT_PATH),
      },
    });
  return (
    <button
      type="button"
      className="rounded-md bg-indigo-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      onClick={() => signout()}
    >
      Logout
    </button>
  );
}
