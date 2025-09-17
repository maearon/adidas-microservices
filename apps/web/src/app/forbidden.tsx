import { Button } from "@/components/ui/button";
import { useTranslations } from "@/hooks/useTranslations";

export default function ForbiddenPage() {
  const t = useTranslations("account")
  return (
    <main className="flex grow items-center justify-center px-4 text-center">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">403 - Forbidden</h1>
          <p className="text-muted-foreground">
            You don&apos;t have access to this page.
          </p>
        </div>
        <div>
          <Button 
            border 
            href="/my-account"
            theme="black" 
            shadow={true} 
            pressEffect={true}>
              {t?.visitYourAccount || "Go to Dashboard"}
          </Button>
        </div>
      </div>
    </main>
  );
}
