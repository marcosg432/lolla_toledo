import * as React from "react";
import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-xl border-2 border-[#7B2433]/50 bg-[#3B1F1A] px-4 py-2 text-base text-[#E2B07E] placeholder:text-[#E2B07E]/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A55B35] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1E1412] focus-visible:border-[#A55B35] disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
