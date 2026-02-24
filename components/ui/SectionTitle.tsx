import { cn } from "@/lib/utils";

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
  titleClassName?: string;
  accent?: string; // parte do título em cor de destaque
}

export function SectionTitle({
  title,
  subtitle,
  centered = true,
  className,
  titleClassName,
  accent,
}: SectionTitleProps) {
  return (
    <div className={cn(centered && "text-center", "mb-10 md:mb-14", className)}>
      <h2
        className={cn(
          "font-heading font-bold text-brand-primary",
          titleClassName
        )}
      >
        {accent ? (
          <>
            {title}{" "}
            <span className="text-brand-secondary">{accent}</span>
          </>
        ) : (
          title
        )}
      </h2>
      {subtitle && (
        <p className="mt-4 text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
          {subtitle}
        </p>
      )}
      {/* Linha decorativa */}
      <div
        className={cn(
          "mt-4 h-1 w-16 bg-brand-accent rounded-full",
          centered && "mx-auto"
        )}
      />
    </div>
  );
}
