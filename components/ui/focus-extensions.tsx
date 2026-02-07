import { cn } from "@/lib/utils";

export type FocusColor = "default" | "accent" | "error" | "warning" | "success" | "info";

export interface FocusRingOptions {
  color?: FocusColor;
  offset?: boolean;
  inset?: boolean;
}

export function getFocusRingClasses(options: FocusRingOptions = {}): string {
  const { color = "accent", offset = true, inset = false } = options;

  const colorMap = {
    default: "focus-visible:ring-border",
    accent: "focus-visible:ring-accent-teal",
    error: "focus-visible:ring-semantic-error",
    warning: "focus-visible:ring-semantic-warning",
    success: "focus-visible:ring-semantic-success",
    info: "focus-visible:ring-semantic-info",
  };

  const baseClasses = "focus-visible:outline-none focus-visible:ring-2";
  const offsetClass = offset ? "focus-visible:ring-offset-2 focus-visible:ring-offset-background" : "";
  const insetClass = inset ? "focus-visible:ring-inset" : "";
  const colorClass = colorMap[color];

  return cn(baseClasses, offsetClass, insetClass, colorClass);
}

export const focusRingVariants = {
  default: () => getFocusRingClasses({ color: "default" }),
  accent: () => getFocusRingClasses({ color: "accent" }),
  error: () => getFocusRingClasses({ color: "error" }),
  warning: () => getFocusRingClasses({ color: "warning" }),
  success: () => getFocusRingClasses({ color: "success" }),
  info: () => getFocusRingClasses({ color: "info" }),
  noOffset: (color: FocusColor = "accent") => 
    getFocusRingClasses({ color, offset: false }),
  inset: (color: FocusColor = "accent") => 
    getFocusRingClasses({ color, inset: true }),
} as const;

export function withFocusRing<T extends { className?: string }>(
  props: T,
  options: FocusRingOptions = {}
): T & { className: string } {
  return {
    ...props,
    className: cn(props.className, getFocusRingClasses(options)),
  };
}
