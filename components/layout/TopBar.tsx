import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface TopBarProps {
  title: string;
  subtitle?: string;
  backHref?: string;
  action?: React.ReactNode;
  className?: string;
  variant?: "default" | "transparent";
}

export default function TopBar({
  title,
  subtitle,
  backHref,
  action,
  className,
  variant = "default",
}: TopBarProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-40 px-4 pt-12 pb-4",
        variant === "default" && "bg-white border-b border-neutral-100",
        variant === "transparent" && "bg-transparent",
        className
      )}
    >
      <div className="flex items-center gap-3">
        {backHref && (
          <Link
            href={backHref}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-neutral-50 hover:bg-neutral-100 transition-colors"
          >
            <ArrowLeft size={18} className="text-foreground" />
          </Link>
        )}
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-bold text-foreground truncate">{title}</h1>
          {subtitle && (
            <p className="text-xs text-neutral-400 font-medium mt-0.5">{subtitle}</p>
          )}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
    </header>
  );
}
