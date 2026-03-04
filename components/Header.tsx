"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Menu, X, Phone, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/empresa", label: "Empresa" },
  { href: "/fotos-servicos", label: "Serviços e Fotos" },
  { href: "/contato", label: "Contato" },
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [logoSrc, setLogoSrc] = useState("/images/logo/logo-white.svg");
  const [headerTelefone, setHeaderTelefone] = useState("");
  const [whatsappNumero, setWhatsappNumero] = useState("");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  // Busca configurações do banco
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        // Busca logo
        const logoRes = await fetch("/api/logo");
        const logoData = await logoRes.json();
        if (logoData.branca) {
          setLogoSrc(logoData.branca);
        } else if (logoData.principal) {
          setLogoSrc(logoData.principal);
        }

        // Busca configurações
        const settingsRes = await fetch("/api/admin/settings");
        const settings = await settingsRes.json();
        
        setHeaderTelefone(settings.header_telefone || "");
        setWhatsappNumero(settings.empresa_whatsapp_numero || "");
      } catch (error) {
        console.error('Header - Erro ao buscar configurações:', error);
      }
    };
    
    fetchConfig();
  }, []);

  // Fecha o menu ao mudar de rota
  const closeMenu = () => setMenuOpen(false);

  // Gera URL do WhatsApp
  const whatsappUrl = (msg = "") => {
    if (!whatsappNumero) return "#";
    const text = encodeURIComponent(msg || "Olá! Gostaria de mais informações.");
    return `https://wa.me/${whatsappNumero}?text=${text}`;
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-40 bg-brand-primary transition-all duration-300",
        scrolled ? "shadow-lg" : "shadow-sm"
      )}
    >
      {/* Top bar — telefone e WhatsApp */}
      <div className="hidden md:block bg-black/20 border-b border-white/10">
        <div className="container-site flex items-center justify-end gap-4 py-1.5 text-sm text-white/80">
          {headerTelefone && (
            <a
              href={`tel:${headerTelefone.replace(/\D/g, "")}`}
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              {headerTelefone}
            </a>
          )}
          {headerTelefone && whatsappNumero && (
            <span className="text-white/30">|</span>
          )}
          {whatsappNumero && (
            <a
              href={whatsappUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-[#25D366] transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              WhatsApp
            </a>
          )}
        </div>
      </div>

      {/* Nav principal */}
      <nav className="container-site">
        <div className="flex items-center justify-between h-20 md:h-24">
          {/* Logo */}
          <Link href="/" onClick={closeMenu} className="flex-shrink-0 flex items-center gap-2">
            <Image
              src={logoSrc}
              alt="Logo"
              width={240}
              height={72}
              className="h-16 md:h-20 w-auto"
              priority
              unoptimized
            />
          </Link>

          {/* Links de nav — desktop */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 text-white/90 hover:text-white font-medium text-sm
                           rounded-md hover:bg-white/10 transition-all duration-200"
              >
                {link.label}
              </Link>
            ))}

            {/* CTA WhatsApp no nav desktop */}
            {whatsappNumero && (
              <a
                href={whatsappUrl("Olá! Gostaria de solicitar um orçamento.")}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-3 btn-accent text-sm py-2 px-4"
              >
                <MessageCircle className="w-4 h-4" />
                Orçamento
              </a>
            )}
          </div>

          {/* Botão hamburger — mobile */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 text-white hover:bg-white/10 rounded-md
                       transition-colors"
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Menu mobile — dropdown */}
        {menuOpen && (
          <div className="md:hidden border-t border-white/20 pb-4 animate-slide-up">
            <div className="flex flex-col gap-1 pt-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMenu}
                  className="px-4 py-3 text-white/90 hover:text-white hover:bg-white/10
                             rounded-md transition-all duration-200 font-medium"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Contato no mobile */}
            {(headerTelefone || whatsappNumero) && (
              <div className="mt-4 pt-4 border-t border-white/20 flex flex-col gap-3 px-4">
                {headerTelefone && (
                  <a
                    href={`tel:${headerTelefone.replace(/\D/g, "")}`}
                    className="flex items-center gap-2 text-white/80 hover:text-white"
                  >
                    <Phone className="w-4 h-4" />
                    {headerTelefone}
                  </a>
                )}
                {whatsappNumero && (
                  <a
                    href={whatsappUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={closeMenu}
                    className="btn-accent w-full justify-center"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Solicitar Orçamento
                  </a>
                )}
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}
