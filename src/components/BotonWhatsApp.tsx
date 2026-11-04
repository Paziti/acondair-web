"use client";

import { usePathname } from "next/navigation";
import { CONTACTO, wa } from "@/data/sitio";

export function BotonWhatsApp() {
  const path = usePathname();
  if (path.startsWith("/panel") || path.startsWith("/checkout")) return null;
  return (
    <a
      href={wa("Hola Acondair, quiero hacer una consulta")}
      target="_blank"
      rel="noopener"
      aria-label={`Escribir por WhatsApp al ${CONTACTO.whatsapp}`}
      className="presionable fixed right-4 bottom-4 z-50 w-14 h-14 rounded-full bg-[#1a8f47] text-white grid place-items-center hover:bg-[#137038]"
    >
      <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3z" />
      </svg>
    </a>
  );
}
