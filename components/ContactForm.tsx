"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import emailjs from "@emailjs/browser";
import { Send, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { empresa } from "@/lib/config";

const schema = z.object({
  nome: z.string().min(2, "Nome deve ter ao menos 2 caracteres"),
  empresa_nome: z.string().optional(),
  telefone: z
    .string()
    .min(10, "Telefone inválido")
    .max(15, "Telefone inválido"),
  email: z.string().email("E-mail inválido"),
  tipo_veiculo: z.string().min(1, "Selecione o tipo de veículo"),
  mensagem: z.string().min(10, "Mensagem deve ter ao menos 10 caracteres"),
  como_conheceu: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const veiculos = [
  "Fiat Fiorino",
  "Fiat Ducato",
  "Mercedes-Benz Sprinter",
  "Renault Master",
  "Citroën/Peugeot Expert",
  "Caminhão Baú",
  "Outro",
];

const comoConheceu = [
  "Google / Busca online",
  "Instagram",
  "Indicação de amigo/colega",
  "Facebook",
  "WhatsApp",
  "Outro",
];

type FormStatus = "idle" | "loading" | "success" | "error";

export function ContactForm({ compact = false }: { compact?: boolean }) {
  const [status, setStatus] = useState<FormStatus>("idle");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setStatus("loading");
    try {
      const payload = {
        from_name: data.nome,
        empresa_nome: data.empresa_nome || "Não informado",
        telefone: data.telefone,
        email: data.email,
        tipo_veiculo: data.tipo_veiculo,
        mensagem: data.mensagem,
        como_conheceu: data.como_conheceu || "Não informado",
        nome: data.nome,
      };

      // Salvar no banco de dados (MySQL via API)
      await fetch("/api/admin/contact-submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      // Enviar por e-mail via EmailJS (se configurado)
      if (empresa.emailjs.publicKey !== "YOUR_PUBLIC_KEY") {
        await emailjs.send(
          empresa.emailjs.serviceId,
          empresa.emailjs.templateId,
          payload,
          empresa.emailjs.publicKey
        );
      }

      setStatus("success");
      reset();
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
        <h3 className="text-xl font-bold text-brand-primary mb-2">
          Mensagem enviada com sucesso!
        </h3>
        <p className="text-gray-600 mb-6">
          Entraremos em contato em breve. Você também pode nos chamar no WhatsApp para uma resposta mais rápida.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="btn-primary"
        >
          Enviar outra mensagem
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      {/* Nome + Empresa */}
      <div className={`grid ${compact ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2"} gap-4`}>
        <div>
          <label className="form-label" htmlFor="nome">
            Nome *
          </label>
          <input
            {...register("nome")}
            id="nome"
            type="text"
            placeholder="Seu nome completo"
            className="form-input"
            autoComplete="name"
          />
          {errors.nome && (
            <p className="form-error">{errors.nome.message}</p>
          )}
        </div>
        {!compact && (
          <div>
            <label className="form-label" htmlFor="empresa_nome">
              Empresa
            </label>
            <input
              {...register("empresa_nome")}
              id="empresa_nome"
              type="text"
              placeholder="Nome da sua empresa (opcional)"
              className="form-input"
              autoComplete="organization"
            />
          </div>
        )}
      </div>

      {/* Telefone + E-mail */}
      <div className={`grid ${compact ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2"} gap-4`}>
        <div>
          <label className="form-label" htmlFor="telefone">
            Telefone / WhatsApp *
          </label>
          <input
            {...register("telefone")}
            id="telefone"
            type="tel"
            placeholder="(11) 9xxxx-xxxx"
            className="form-input"
            autoComplete="tel"
          />
          {errors.telefone && (
            <p className="form-error">{errors.telefone.message}</p>
          )}
        </div>
        <div>
          <label className="form-label" htmlFor="email">
            E-mail *
          </label>
          <input
            {...register("email")}
            id="email"
            type="email"
            placeholder="seu@email.com"
            className="form-input"
            autoComplete="email"
          />
          {errors.email && (
            <p className="form-error">{errors.email.message}</p>
          )}
        </div>
      </div>

      {/* Tipo de veículo */}
      <div>
        <label className="form-label" htmlFor="tipo_veiculo">
          Tipo de Veículo *
        </label>
        <select
          {...register("tipo_veiculo")}
          id="tipo_veiculo"
          className="form-input"
          defaultValue=""
        >
          <option value="" disabled>
            Selecione o veículo
          </option>
          {veiculos.map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </select>
        {errors.tipo_veiculo && (
          <p className="form-error">{errors.tipo_veiculo.message}</p>
        )}
      </div>

      {/* Mensagem */}
      <div>
        <label className="form-label" htmlFor="mensagem">
          Mensagem *
        </label>
        <textarea
          {...register("mensagem")}
          id="mensagem"
          rows={compact ? 3 : 5}
          placeholder="Descreva o que precisa — tipo de produto, rota, temperatura necessária..."
          className="form-input resize-none"
        />
        {errors.mensagem && (
          <p className="form-error">{errors.mensagem.message}</p>
        )}
      </div>

      {/* Como nos conheceu */}
      {!compact && (
        <div>
          <label className="form-label" htmlFor="como_conheceu">
            Como nos conheceu?
          </label>
          <select
            {...register("como_conheceu")}
            id="como_conheceu"
            className="form-input"
            defaultValue=""
          >
            <option value="">Selecione (opcional)</option>
            {comoConheceu.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Erro geral */}
      {status === "error" && (
        <div className="flex items-center gap-2 text-red-600 bg-red-50 rounded-lg p-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm">
            Erro ao enviar. Tente novamente ou nos chame no WhatsApp.
          </p>
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={status === "loading"}
        className="btn-accent w-full justify-center py-4 text-lg disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {status === "loading" ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Enviando...
          </>
        ) : (
          <>
            <Send className="w-5 h-5" />
            Enviar Mensagem
          </>
        )}
      </button>

      <p className="text-xs text-gray-400 text-center">
        Seus dados são usados apenas para retorno de contato. Não compartilhamos com terceiros.
      </p>
    </form>
  );
}
