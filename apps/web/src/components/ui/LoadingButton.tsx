import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { BaseButton, BaseButtonProps } from "./base-button";

interface LoadingButtonProps extends BaseButtonProps {
  loading: boolean;
}

export default function LoadingButton({
  loading,
  disabled,
  className,
  ...props
}: LoadingButtonProps) {
  return (
    <BaseButton
      disabled={loading || disabled}
      className={cn("flex items-center gap-2", className)}
      {...props}
    >
      {loading ? (
        <Loader2 className="h-6 w-6 animate-spin" />
      ) : (
        props.children
      )}
    </BaseButton>
  );
}
