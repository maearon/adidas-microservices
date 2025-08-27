import * as React from "react";
import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        {...props}
        className={cn(
          "w-full px-3 py-2 text-base border border-black dark:border-white rounded-none focus:outline-hidden focus:ring-2 focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed",
          className
        )}
      />
    );
  }
);

Input.displayName = "Input";

export { Input };
