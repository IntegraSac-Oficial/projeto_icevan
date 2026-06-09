import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Utilitário para combinar classes Tailwind sem conflitos */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Formata número de WhatsApp para URL de deep link */
export function whatsappUrl(message?: string | null, phoneNumber?: string): string {
  const number = phoneNumber || "5511948242999";
  const defaultMessage = "Olá! Gostaria de solicitar um orçamento para refrigeração de veículo.";
  const text = message === undefined ? defaultMessage : message ?? "";

  if (!text) {
    return `https://wa.me/${number}`;
  }

  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}
