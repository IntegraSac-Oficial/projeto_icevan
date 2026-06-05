import { cn } from "@/lib/utils";

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
  titleClassName?: string;
  accent?: string; // parte do título em cor de destaque (deprecated, use [texto] no title)
}

/**
 * Processa o texto do título para destacar partes entre colchetes [texto]
 * Exemplo: "Por que escolher a [Ice Van]" -> "Por que escolher a " + <span>Ice Van</span>
 */
function parseTitle(title: string) {
  const parts: (string | JSX.Element)[] = [];
  let currentText = "";
  let insideBrackets = false;
  let bracketText = "";
  let key = 0;

  for (let i = 0; i < title.length; i++) {
    const char = title[i];

    if (char === "[") {
      if (currentText) {
        parts.push(currentText);
        currentText = "";
      }
      insideBrackets = true;
      bracketText = "";
    } else if (char === "]" && insideBrackets) {
      parts.push(
        <span key={key++} className="text-brand-accent">
          {bracketText}
        </span>
      );
      insideBrackets = false;
      bracketText = "";
    } else {
      if (insideBrackets) {
        bracketText += char;
      } else {
        currentText += char;
      }
    }
  }

  if (currentText) {
    parts.push(currentText);
  }

  return parts.length > 0 ? parts : title;
}

export function SectionTitle({
  title,
  subtitle,
  centered = true,
  className,
  titleClassName,
  accent,
}: SectionTitleProps) {
  const processedTitle = parseTitle(title);

  return (
    <div className={cn(centered && "text-center", "mb-10 md:mb-14", className)}>
      <h2
        className={cn(
          "font-heading font-bold text-brand-primary",
          titleClassName
        )}
      >
        {accent ? (
          // Modo antigo (compatibilidade)
          <>
            {title}{" "}
            <span className="text-brand-accent">{accent}</span>
          </>
        ) : (
          // Modo novo: processa [texto] automaticamente
          processedTitle
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
