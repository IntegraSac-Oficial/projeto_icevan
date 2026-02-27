"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import {
  IconWhatsApp,
  IconInstagram,
  IconFacebook,
  IconYouTube,
  IconTikTok,
  IconLinkedIn,
  IconX,
} from "@/components/ui/social-icons";
import { empresa } from "@/lib/config";
import { whatsappUrl } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/empresa", label: "Empresa" },
  { href: "/fotos-servicos", label: "Serviços e Fotos" },
  { href: "/contato", label: "Contato" },
];

const DEFAULT_APLICACOES = [
  { href: "/fiorinos",                  label: "Fiorinos" },
  { href: "/van-ducato",                label: "Van Ducato" },
  { href: "/van-sprinter",              label: "Van Sprinter" },
  { href: "/van-master",                label: "Van Master" },
  { href: "/expert-porta-frigorifica",  label: "Expert c/ Porta Frigorífica" },
  { href: "/fiorino-porta-frigorifica", label: "Fiorino c/ Porta Frigorífica" },
];

export function Footer() {
  const [logoSrc, setLogoSrc] = useState("/images/logo/logo-white.svg");
  const [aplicacoes, setAplicacoes] = useState(DEFAULT_APLICACOES);

  // Tipo explícito para permitir valores dinâmicos
  type TextosFooter = {
    descricao: string;
    endereco: string;
    telefone: string;
    email: string;
    horario: string;
    footerCopyright: string;
    footerRodape: string;
  };

  const [textos, setTextos] = useState<TextosFooter>({
    descricao:       empresa.descricao,
    endereco:        empresa.enderecoCompleto,
    telefone:        empresa.telefone,
    email:           empresa.email,
    horario:         empresa.horario,
    footerCopyright: `© ${new Date().getFullYear()} ${empresa.nome}. Todos os direitos reservados.`,
    footerRodape:    "CNPJ — Refrigeração para Transporte | São Paulo, SP",
  });

  // Busca logo, textos dinâmicos e registro de veículos
  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const res = await fetch("/api/logo?t=" + Date.now());
        const data = await res.json();
        if (data.branca) {
          setLogoSrc(data.branca + '?t=' + Date.now());
        } else if (data.principal) {
          setLogoSrc(data.principal + '?t=' + Date.now());
        }
      } catch (error) {
        console.error('Footer - Erro ao buscar logo:', error);
      }
    };

    const fetchTextos = async () => {
      try {
        const res = await fetch("/api/admin/settings");
        const data: Record<string, string> = await res.json();
        setTextos((prev) => ({
          descricao:       data.empresa_descricao  || prev.descricao,
          endereco:        data.empresa_endereco   || prev.endereco,
          telefone:        data.empresa_telefone   || prev.telefone,
          email:           data.empresa_email      || prev.email,
          horario:         data.empresa_horario    || prev.horario,
          footerCopyright: data.footer_copyright   || prev.footerCopyright,
          footerRodape:    data.footer_rodape      || prev.footerRodape,
        }));
        // Atualiza lista de aplicações com o registro de veículos
        if (data["vehicles_registry"]) {
          try {
            const registry = JSON.parse(data["vehicles_registry"]) as { href: string; label: string }[];
            if (Array.isArray(registry) && registry.length > 0) {
              setAplicacoes(registry.map((v) => ({ href: v.href, label: v.label })));
            }
          } catch { /* usa padrão */ }
        }
      } catch {
        // mantém fallbacks do config
      }
    };

    fetchLogo();
    fetchTextos();
  }, []);

  return (
    <footer className="bg-brand-primary text-white">
      {/* Área principal */}
      <div className="container-site py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Coluna 1 — Logo + sobre */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <Image
                src={logoSrc}
                alt={empresa.nome}
                width={200}
                height={60}
                className="h-14 w-auto"
                unoptimized
                key={logoSrc}
              />
              <span className="block text-white font-heading font-bold text-xl mt-2">
                {empresa.nome}
              </span>
            </Link>
            <p className="text-white/70 text-sm leading-relaxed mb-5">
              {textos.descricao}
            </p>
            {/* Redes sociais */}
            <div className="flex items-center gap-2 flex-wrap">
              <a
                href={whatsappUrl()}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="p-2 rounded-full bg-white/10 hover:bg-[#25D366]
                           transition-colors duration-200"
              >
                <IconWhatsApp className="w-4 h-4" />
              </a>
              {empresa.instagram && (
                <a
                  href={empresa.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="p-2 rounded-full bg-white/10 hover:bg-[#E1306C]
                             transition-colors duration-200"
                >
                  <IconInstagram className="w-4 h-4" />
                </a>
              )}
              {empresa.facebook && (
                <a
                  href={empresa.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="p-2 rounded-full bg-white/10 hover:bg-[#1877F2]
                             transition-colors duration-200"
                >
                  <IconFacebook className="w-4 h-4" />
                </a>
              )}
              {empresa.youtube && (
                <a
                  href={empresa.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  className="p-2 rounded-full bg-white/10 hover:bg-[#FF0000]
                             transition-colors duration-200"
                >
                  <IconYouTube className="w-4 h-4" />
                </a>
              )}
              {empresa.tiktok && (
                <a
                  href={empresa.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="TikTok"
                  className="p-2 rounded-full bg-white/10 hover:bg-white hover:text-black
                             transition-colors duration-200"
                >
                  <IconTikTok className="w-4 h-4" />
                </a>
              )}
              {empresa.linkedin && (
                <a
                  href={empresa.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="p-2 rounded-full bg-white/10 hover:bg-[#0A66C2]
                             transition-colors duration-200"
                >
                  <IconLinkedIn className="w-4 h-4" />
                </a>
              )}
              {empresa.twitter && (
                <a
                  href={empresa.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="X"
                  className="p-2 rounded-full bg-white/10 hover:bg-white hover:text-black
                             transition-colors duration-200"
                >
                  <IconX className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Coluna 2 — Menu */}
          <div>
            <h3 className="font-heading font-semibold text-sm uppercase tracking-wider
                           text-brand-secondary mb-4">
              Menu
            </h3>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/70 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Coluna 3 — Aplicações */}
          <div>
            <h3 className="font-heading font-semibold text-sm uppercase tracking-wider
                           text-brand-secondary mb-4">
              Aplicações
            </h3>
            <ul className="space-y-2">
              {aplicacoes.map((ap) => (
                <li key={ap.href}>
                  <Link
                    href={ap.href}
                    className="text-white/70 hover:text-white text-sm transition-colors"
                  >
                    {ap.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Coluna 4 — Contato */}
          <div>
            <h3 className="font-heading font-semibold text-sm uppercase tracking-wider
                           text-brand-secondary mb-4">
              Contato
            </h3>
            <ul className="space-y-3 text-sm text-white/70">
              <li className="flex gap-2.5">
                <MapPin className="w-4 h-4 text-brand-accent flex-shrink-0 mt-0.5" />
                <span>{textos.endereco}</span>
              </li>
              <li>
                <a
                  href={`tel:${textos.telefone.replace(/\D/g, "")}`}
                  className="flex gap-2.5 hover:text-white transition-colors"
                >
                  <Phone className="w-4 h-4 text-brand-accent flex-shrink-0 mt-0.5" />
                  {textos.telefone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${textos.email}`}
                  className="flex gap-2.5 hover:text-white transition-colors"
                >
                  <Mail className="w-4 h-4 text-brand-accent flex-shrink-0 mt-0.5" />
                  {textos.email}
                </a>
              </li>
              <li className="flex gap-2.5">
                <Clock className="w-4 h-4 text-brand-accent flex-shrink-0 mt-0.5" />
                <span>{textos.horario}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Barra inferior — copyright */}
      <div className="border-t border-white/10">
        <div className="container-site py-4 flex flex-col sm:flex-row items-center
                        justify-between gap-2 text-sm text-white/50">
          <p>{textos.footerCopyright}</p>
          <p>{textos.footerRodape}</p>
        </div>
      </div>
    </footer>
  );
}
