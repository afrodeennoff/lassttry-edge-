import * as React from "react";
import { cn } from "@/lib/utils";

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "strong" | "subtle";
  hover?: boolean;
}

const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, variant = "default", hover = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-xl border transition-all duration-200",
          {
            "bg-glass backdrop-blur-glass shadow-glass": variant === "default",
            "bg-glass-strong backdrop-blur-glass-strong shadow-glass": variant === "strong",
            "bg-glass-subtle backdrop-blur-glass": variant === "subtle",
            "hover:bg-glass-strong hover:border-border-strong hover:shadow-lg hover:-translate-y-0.5": hover,
          },
          className
        )}
        {...props}
      />
    );
  }
);
GlassCard.displayName = "GlassCard";

export { GlassCard };
