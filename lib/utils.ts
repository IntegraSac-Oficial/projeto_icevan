import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Tipagem para Google Ads gtag
declare global {
  interface Window {
    gtag?: (
      command: string,
      action: string,
      params?: Record<string, unknown>
    ) => void;
    dataLayer?: unknown[];
  }
}

/** Utilitário para combinar classes Tailwind sem conflitos */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Formata número de WhatsApp para URL de deep link */
export function whatsappUrl(message?: string): string {
  const number = "5511948242999";
  const text = message
    ? encodeURIComponent(message)
    : encodeURIComponent(
        "Olá! Gostaria de solicitar um orçamento para refrigeração de veículo."
      );
  return `https://wa.me/${number}?text=${text}`;
}

/**
 * Dispara evento de conversão do Google Ads para clique no WhatsApp
 * Só dispara se gtag estiver disponível (tag do Google Ads carregada)
 */
export function trackWhatsAppClick(): void {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", "conversion", {
      send_to: "AW-18056785768/CnPnCPiTqpgcEOjekqJD",
      value: 1.0,
      currency: "BRL",
    });
  }
}
