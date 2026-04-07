import { cn } from "@/lib/utils";

type BadgeVariant = "blue" | "green" | "orange" | "gold" | "neutral" | "red";

const variants: Record<BadgeVariant, string> = {
  blue:    "bg-primary-100 text-primary-600",
  green:   "bg-success-light text-success",
  orange:  "bg-warning-light text-warning",
  gold:    "bg-gold-light text-yellow-600",
  neutral: "bg-neutral-100 text-neutral-500",
  red:     "bg-destructive-light text-destructive",
};

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

export default function Badge({ children, variant = "neutral", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
