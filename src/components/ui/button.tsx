import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A55B35] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1E1412] disabled:pointer-events-none disabled:opacity-50 font-[family-name:var(--font-inter)]",
  {
    variants: {
      variant: {
        default:
          "bg-[#A55B35] text-[#0B0908] hover:bg-[#C98A48] hover:shadow-[0_0_28px_rgba(201,138,72,0.4)] active:scale-[0.98]",
        destructive: "bg-red-500/90 text-white hover:bg-red-600",
        outline:
          "border-2 border-[#7B2433]/50 bg-transparent text-[#E2B07E] hover:bg-[#3B1F1A]/80 hover:border-[#A55B35] hover:text-[#C98A48]",
        secondary: "bg-[#3B1F1A] text-[#E2B07E] border border-[#7B2433]/50 hover:bg-[#4A2520] hover:border-[#7B2433]",
        ghost: "text-[#E2B07E] hover:bg-[#3B1F1A]/60 hover:text-[#C98A48]",
        link: "text-[#C98A48] underline-offset-4 hover:underline hover:text-[#E2B07E]",
      },
      size: {
        default: "h-11 px-6 py-2 text-sm",
        sm: "h-9 rounded-xl px-4 text-sm",
        lg: "h-12 rounded-xl px-8 text-base",
        xl: "h-14 rounded-xl px-10 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
