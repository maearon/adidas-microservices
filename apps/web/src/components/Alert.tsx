import { useTranslations } from "@/hooks/useTranslations";

export default function Alert() {
  const t = useTranslations("auth");
  
  return (
    <div className="rounded-md bg-yellow-50 p-4">
      <div className="flex">
        <div className="ml-3">
          <h3 className="text-sm font-medium text-yellow-800">
            {t?.loginCredential || "Login Credential"}
          </h3>
          <div className="mt-2 text-sm text-yellow-700">
            <p>Username: nextauth@example.com</p>
            <p>{t?.password || "Password"}: password</p>
          </div>
        </div>
      </div>
    </div>
  );
}
