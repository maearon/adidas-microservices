import { getServerSession } from "@/lib/get-session";
import type { Metadata } from "next";
import { forbidden, unauthorized } from "next/navigation";
import { DeleteApplication } from "./delete-application";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "👕Admin' Sneakers and Activewear | adidas US👕",
    description: "Shop the latest kids' shoes, clothing, and accessories at adidas US.",
  };
}

export default async function AdminPage() {
  const session = await getServerSession();
  const user = session?.user;

  if (!user) unauthorized();

  if (user.role !== "admin") forbidden();

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-12">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">Admin</h1>
          <p className="text-muted-foreground">
            You have administrator access.
          </p>
        </div>
        <DeleteApplication />
      </div>
    </main>
  );
}
