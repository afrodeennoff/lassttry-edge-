import * as React from "react";
import { cn } from "@/lib/utils";

export interface InteractiveBorderProps extends React.HTMLAttributes<HTMLDivElement> {
  focusColor?: "default" | "accent" | "error" | "warning" | "success";
}

const InteractiveBorder = React.forwardRef<HTMLDivElement, InteractiveBorderProps>(
  ({ className, focusColor = "accent", children, ...props }, ref) => {
    const focusColorMap = {
      default: "focus-visible:ring-border",
      accent: "focus-visible:ring-accent-teal/50",
      error: "focus-visible:ring-semantic-error/50",
      warning: "focus-visible:ring-semantic-warning/50",
      success: "focus-visible:ring-semantic-success/50",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-lg border border-border-subtle transition-all duration-200",
          "hover:border-border-default hover:bg-white/5",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          focusColorMap[focusColor],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
InteractiveBorder.displayName = "InteractiveBorder";

export { InteractiveBorder };
