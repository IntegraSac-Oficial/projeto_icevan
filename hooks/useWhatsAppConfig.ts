"use client";

import { useCallback, useEffect, useState } from "react";
import { buildWhatsAppUrl } from "@/lib/whatsapp-config";

export function useWhatsAppConfig(defaultNumber = "") {
  const [message, setMessage] = useState("");
  const [number, setNumber] = useState(defaultNumber);

  useEffect(() => {
    let isActive = true;

    fetch("/api/admin/settings")
      .then((res) => res.json())
      .then((data) => {
        if (!isActive) return;

        setMessage(data.whatsapp_mensagem_padrao ?? "");
        setNumber(
          data.whatsapp_floating_numero ||
            data.empresa_whatsapp_numero ||
            data.empresa_whatsapp ||
            defaultNumber
        );
      })
      .catch(() => {
        if (!isActive) return;
        setMessage("");
        setNumber(defaultNumber);
      });

    return () => {
      isActive = false;
    };
  }, [defaultNumber]);

  const buildUrl = useCallback(
    (overrideMessage?: string | null, overrideNumber?: string | null) =>
      buildWhatsAppUrl(overrideNumber ?? number, overrideMessage ?? message),
    [message, number]
  );

  return { message, number, buildUrl };
}
