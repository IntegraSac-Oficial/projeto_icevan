import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import { whatsappUrl } from "@/lib/utils";
import type { Application } from "@/lib/applications";

interface ApplicationCardProps {
  application: Application;
}

export function ApplicationCard({ application }: ApplicationCardProps) {
  const { slug, titulo, subtitulo, thumb, href } = application;
  const pageHref = href ?? `/${slug}`;

  return (
    <div className="card group flex flex-col hover:-translate-y-1 transition-transform duration-300">
      {/* Imagem */}
      <div className="relative h-52 overflow-hidden">
        <Image
          src={thumb}
          alt={`${titulo} — Ice Van`}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          unoptimized
          key={thumb}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-primary/40 to-transparent" />
      </div>

      {/* Conteúdo */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-heading font-bold text-brand-primary text-xl mb-2">
          {titulo}
        </h3>
        <p className="text-gray-600 text-sm leading-relaxed flex-1 mb-5">
          {subtitulo}
        </p>

        {/* Ações */}
        <div className="flex flex-col sm:flex-row gap-2 mt-auto">
          <Link
            href={pageHref}
            className="flex-1 btn-outline text-sm py-2.5 justify-center"
          >
            Saiba mais
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href={whatsappUrl(
              `Olá! Tenho interesse em refrigeração para ${titulo}. Poderia me enviar um orçamento?`
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 btn-accent text-sm py-2.5 justify-center"
          >
            <MessageCircle className="w-4 h-4" />
            Orçamento
          </a>
        </div>
      </div>
    </div>
  );
}
