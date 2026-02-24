import type { Metadata } from "next";
import Link from "next/link";
import {
  ChevronRight,
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageCircle,
  Instagram,
} from "lucide-react";
import { ContactForm } from "@/components/ContactForm";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { empresa } from "@/lib/config";
import { whatsappUrl } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Contato — Solicite um Orçamento",
  description:
    "Entre em contato com a Ice Van para solicitar orçamento de refrigeração para seu veículo. Atendemos por WhatsApp, telefone e formulário.",
  alternates: { canonical: "/contato" },
};

export default function ContatoPage() {
  return (
    <main className="pt-24 md:pt-28">
      {/* Hero da página */}
      <section className="bg-brand-primary text-white py-14 md:py-20">
        <div className="container-site">
          <div className="max-w-3xl">
            <p className="text-brand-secondary text-sm font-semibold uppercase tracking-wider mb-3">
              Fale conosco
            </p>
            <h1 className="text-white mb-5">Solicite um Orçamento</h1>
            <p className="text-white/80 text-xl leading-relaxed">
              Preencha o formulário abaixo ou entre em contato diretamente pelo
              WhatsApp. Nossa equipe retorna rapidamente com a melhor solução
              para o seu veículo.
            </p>
          </div>
        </div>
      </section>

      {/* Conteúdo principal */}
      <section className="section-padding bg-white">
        <div className="container-site">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Formulário — 2/3 */}
            <div className="lg:col-span-2">
              <SectionTitle
                title="Formulário de Contato"
                subtitle="Preencha os campos abaixo e entraremos em contato em breve."
                centered={false}
              />
              <div className="bg-brand-light rounded-2xl p-6 md:p-8">
                <ContactForm />
              </div>
            </div>

            {/* Informações — 1/3 */}
            <div className="space-y-6">
              {/* Card de info de contato */}
              <div className="card p-6">
                <h3 className="font-heading font-bold text-brand-primary text-lg mb-5">
                  Informações de Contato
                </h3>
                <ul className="space-y-4">
                  <li>
                    <a
                      href={whatsappUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex gap-3 text-gray-700 hover:text-[#25D366] transition-colors group"
                    >
                      <div className="p-2 rounded-lg bg-[#25D366]/10 group-hover:bg-[#25D366]/20 transition-colors flex-shrink-0">
                        <MessageCircle className="w-5 h-5 text-[#25D366]" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 uppercase tracking-wider mb-0.5">
                          WhatsApp
                        </p>
                        <p className="font-semibold">{empresa.whatsapp}</p>
                      </div>
                    </a>
                  </li>
                  <li>
                    <a
                      href={`tel:${empresa.telefone.replace(/\D/g, "")}`}
                      className="flex gap-3 text-gray-700 hover:text-brand-primary transition-colors group"
                    >
                      <div className="p-2 rounded-lg bg-brand-primary/10 group-hover:bg-brand-primary/20 transition-colors flex-shrink-0">
                        <Phone className="w-5 h-5 text-brand-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 uppercase tracking-wider mb-0.5">
                          Telefone
                        </p>
                        <p className="font-semibold">{empresa.telefone}</p>
                      </div>
                    </a>
                  </li>
                  <li>
                    <a
                      href={`mailto:${empresa.email}`}
                      className="flex gap-3 text-gray-700 hover:text-brand-primary transition-colors group"
                    >
                      <div className="p-2 rounded-lg bg-brand-primary/10 group-hover:bg-brand-primary/20 transition-colors flex-shrink-0">
                        <Mail className="w-5 h-5 text-brand-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 uppercase tracking-wider mb-0.5">
                          E-mail
                        </p>
                        <p className="font-semibold">{empresa.email}</p>
                      </div>
                    </a>
                  </li>
                  <li className="flex gap-3 text-gray-700">
                    <div className="p-2 rounded-lg bg-brand-primary/10 flex-shrink-0">
                      <MapPin className="w-5 h-5 text-brand-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wider mb-0.5">
                        Endereço
                      </p>
                      <p className="font-semibold text-sm leading-relaxed">
                        {empresa.enderecoCompleto}
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-3 text-gray-700">
                    <div className="p-2 rounded-lg bg-brand-primary/10 flex-shrink-0">
                      <Clock className="w-5 h-5 text-brand-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wider mb-0.5">
                        Horário
                      </p>
                      <p className="font-semibold text-sm">{empresa.horario}</p>
                    </div>
                  </li>
                </ul>
              </div>

              {/* WhatsApp CTA */}
              <a
                href={whatsappUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-accent w-full justify-center py-4 text-lg"
              >
                <MessageCircle className="w-5 h-5" />
                Chamar no WhatsApp
              </a>

              {/* Instagram */}
              {empresa.instagram && (
                <a
                  href={empresa.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-gray-600 hover:text-brand-accent
                             transition-colors font-medium"
                >
                  <Instagram className="w-5 h-5" />
                  Siga-nos no Instagram
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Mapa */}
      <section className="h-80 md:h-96 relative">
        <iframe
          src={empresa.googleMapsEmbed}
          title={`Localização da ${empresa.nome}`}
          className="w-full h-full border-0"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          aria-label="Mapa com localização da Ice Van"
        />
      </section>
    </main>
  );
}
