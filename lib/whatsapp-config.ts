import { getSetting } from "@/lib/settings";

export const DEFAULT_WHATSAPP_MESSAGE =
  "Olá! Gostaria de falar com a Ice Van sobre isolamento térmico para meu veículo.";

export function buildWhatsAppUrl(number?: string | null, message?: string | null): string {
  const digits = (number ?? "").replace(/\D/g, "");

  if (!digits) return "#";
  if (!message) return `https://wa.me/${digits}`;

  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export async function getConfiguredWhatsAppMessage(): Promise<string> {
  const message = await getSetting("whatsapp_mensagem_padrao", DEFAULT_WHATSAPP_MESSAGE);
  return message ?? "";
}

export async function getConfiguredWhatsAppUrl(number?: string | null, message?: string | null): Promise<string> {
  const resolvedMessage = message ?? (await getConfiguredWhatsAppMessage());
  return buildWhatsAppUrl(number, resolvedMessage);
}
