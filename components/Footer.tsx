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
import { eventBus, EVENTS } from "@/lib/events";

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
  const [contatos, setContatos] = useState<{ label: string; numero: string }[]>([]);

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

  type RedesSociais = {
    instagram: string;
    facebook: string;
    youtube: string;
    tiktok: string;
    linkedin: string;
    twitter: string;
  };

  const [textos, setTextos] = useState<TextosFooter>({
    descricao: "",
    endereco: "",
    telefone: "",
    email: "",
    horario: "",
    footerCopyright: "",
    footerRodape: "",
  });

  const [redes, setRedes] = useState<RedesSociais>({
    instagram: "",
    facebook: "",
    youtube: "",
    tiktok: "",
    linkedin: "",
    twitter: "",
  });

  const [nomeEmpresa, setNomeEmpresa] = useState("");
  const [whatsappNumero, setWhatsappNumero] = useState("");

  // Função para gerar URL do WhatsApp
  const whatsappUrl = () => {
    const numero = whatsappNumero.replace(/\D/g, "");
    return `https://wa.me/${numero}`;
  };

  // Busca logo, textos dinâmicos e registro de veículos
  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const res = await fetch("/api/logo");
        const data = await res.json();
        if (data.branca) {
          setLogoSrc(data.branca);
        } else if (data.principal) {
          setLogoSrc(data.principal);
        }
      } catch (error) {
        console.error('Footer - Erro ao buscar logo:', error);
      }
    };

    const fetchTextos = async () => {
      try {
        const res = await fetch("/api/admin/settings");
        const data: Record<string, string> = await res.json();
        
        console.log('Footer - Dados recebidos:', data);
        console.log('Footer - vehicles_registry:', data["vehicles_registry"]);
        
        setTextos((prev) => ({
          descricao:       data.empresa_descricao  || "",
          endereco:        data.empresa_endereco   || "",
          telefone:        data.empresa_telefone   || "",
          email:           data.empresa_email      || "",
          horario:         data.empresa_horario    || "",
          footerCopyright: data.footer_copyright   || "",
          footerRodape:    data.footer_rodape      || "",
        }));

        // Atualiza redes sociais
        setRedes((prev) => ({
          instagram: data.empresa_instagram || "",
          facebook:  data.empresa_facebook  || "",
          youtube:   data.empresa_youtube   || "",
          tiktok:    data.empresa_tiktok    || "",
          linkedin:  data.empresa_linkedin  || "",
          twitter:   data.empresa_twitter   || "",
        }));

        // Atualiza nome da empresa e WhatsApp
        setNomeEmpresa(data.empresa_nome || "");
        setWhatsappNumero(data.empresa_whatsapp_numero || "");
        
        // Atualiza lista de aplicações com o registro de veículos
        if (data["vehicles_registry"]) {
          try {
            const registry = JSON.parse(data["vehicles_registry"]) as { href: string; label: string; ordem?: number }[];
            console.log('Footer - Registry parseado:', registry);
            
            if (Array.isArray(registry) && registry.length > 0) {
              // Ordena por ordem se disponível
              const sorted = registry.sort((a, b) => (a.ordem || 0) - (b.ordem || 0));
              const aplicacoesAtualizadas = sorted.map((v) => ({ href: v.href, label: v.label }));
              console.log('Footer - Aplicações atualizadas:', aplicacoesAtualizadas);
              setAplicacoes(aplicacoesAtualizadas);
            }
          } catch (err) {
            console.error('Footer - Erro ao parsear vehicles_registry:', err);
          }
        }

        // Busca os contatos da lista de contatos (sincroniza com a página de contato)
        if (data["empresa_contatos"]) {
          try {
            const contatosList = JSON.parse(data["empresa_contatos"]) as { label: string; numero: string }[];
            console.log('Footer - Contatos parseados:', contatosList);
            if (Array.isArray(contatosList) && contatosList.length > 0) {
              setContatos(contatosList);
            }
          } catch (err) {
            console.error('Footer - Erro ao parsear empresa_contatos:', err);
          }
        }
      
      
      } catch {
        // mantém fallbacks do config
      }
    };

    fetchLogo();
    fetchTextos();
    
    // Escuta eventos de atualização
    const handleVehiclesUpdate = () => {
      console.log('Footer - Evento de atualização de veículos recebido');
      fetchTextos();
    };
    
    eventBus.on(EVENTS.VEHICLES_UPDATED, handleVehiclesUpdate);
    eventBus.on(EVENTS.SETTINGS_UPDATED, handleVehiclesUpdate);
    
    return () => {
      eventBus.off(EVENTS.VEHICLES_UPDATED, handleVehiclesUpdate);
      eventBus.off(EVENTS.SETTINGS_UPDATED, handleVehiclesUpdate);
    };
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
                alt={nomeEmpresa || "Logo"}
                width={200}
                height={60}
                className="h-14 w-auto"
                unoptimized
              />
              {nomeEmpresa && (
                <span className="block text-white font-heading font-bold text-xl mt-2">
                  {nomeEmpresa}
                </span>
              )}
            </Link>
            <p className="text-white/70 text-sm leading-relaxed mb-5">
              {textos.descricao}
            </p>
            {/* Redes sociais */}
            <div className="flex items-center gap-2 flex-wrap">
              {whatsappNumero && (
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
              )}
              {redes.instagram && (
                <a
                  href={redes.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="p-2 rounded-full bg-white/10 hover:bg-[#E1306C]
                             transition-colors duration-200"
                >
                  <IconInstagram className="w-4 h-4" />
                </a>
              )}
              {redes.facebook && (
                <a
                  href={redes.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="p-2 rounded-full bg-white/10 hover:bg-[#1877F2]
                             transition-colors duration-200"
                >
                  <IconFacebook className="w-4 h-4" />
                </a>
              )}
              {redes.youtube && (
                <a
                  href={redes.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  className="p-2 rounded-full bg-white/10 hover:bg-[#FF0000]
                             transition-colors duration-200"
                >
                  <IconYouTube className="w-4 h-4" />
                </a>
              )}
              {redes.tiktok && (
                <a
                  href={redes.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="TikTok"
                  className="p-2 rounded-full bg-white/10 hover:bg-white hover:text-black
                             transition-colors duration-200"
                >
                  <IconTikTok className="w-4 h-4" />
                </a>
              )}
              {redes.linkedin && (
                <a
                  href={redes.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="p-2 rounded-full bg-white/10 hover:bg-[#0A66C2]
                             transition-colors duration-200"
                >
                  <IconLinkedIn className="w-4 h-4" />
                </a>
              )}
              {redes.twitter && (
                <a
                  href={redes.twitter}
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
              {contatos.length > 0 ? (
                contatos.map((contato, index) => (
                  <li key={index}>
                    <a
                      href={`https://wa.me/${contato.numero.replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex gap-2.5 hover:text-white transition-colors"
                    >
                      <Phone className="w-4 h-4 text-brand-accent flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="block font-medium">{contato.label}</span>
                        <span className="block text-xs">{contato.numero}</span>
                      </div>
                    </a>
                  </li>
                ))
              ) : (
                <li>
                  <a
                    href={`tel:${textos.telefone.replace(/\D/g, "")}`}
                    className="flex gap-2.5 hover:text-white transition-colors"
                  >
                    <Phone className="w-4 h-4 text-brand-accent flex-shrink-0 mt-0.5" />
                    {textos.telefone}
                  </a>
                </li>
              )}
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
