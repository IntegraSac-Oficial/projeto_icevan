import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Utilitário para combinar classes Tailwind sem conflitos */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Formata número de WhatsApp para URL de deep link */
export function whatsappUrl(message?: string, phoneNumber?: string): string {
  // Usa o número fornecido ou fallback para o número padrão
  const number = phoneNumber || "5511948242999";
  const text = message
    ? encodeURIComponent(message)
    : encodeURIComponent(
        "Olá! Gostaria de solicitar um orçamento para refrigeração de veículo."
      );
  return `https://wa.me/${number}?text=${text}`;
}
