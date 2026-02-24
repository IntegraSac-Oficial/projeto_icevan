"use client";

import { useEffect, useState, useCallback } from "react";
import {
  MessageSquare,
  Trash2,
  Eye,
  CheckCheck,
  X,
  Loader2,
  Search,
  Phone,
  Mail,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface Contact {
  id: number;
  nome: string;
  empresa: string | null;
  telefone: string;
  email: string;
  tipoVeiculo: string;
  mensagem: string;
  comoConheceu: string | null;
  lido: boolean;
  createdAt: string;
}

export default function ContatosPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Contact | null>(null);
  const [search, setSearch] = useState("");

  const fetchContacts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/contacts");
      const data = await res.json();
      setContacts(data.contacts ?? []);
      setTotal(data.total ?? 0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  const markRead = async (id: number, lido: boolean) => {
    await fetch(`/api/admin/contacts/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lido }),
    });
    setContacts((prev) =>
      prev.map((c) => (c.id === id ? { ...c, lido } : c))
    );
  };

  const deleteContact = async (id: number) => {
    if (!confirm("Deletar este contato?")) return;
    await fetch(`/api/admin/contacts/${id}`, { method: "DELETE" });
    setContacts((prev) => prev.filter((c) => c.id !== id));
    setTotal((t) => t - 1);
    if (selected?.id === id) setSelected(null);
  };

  const filtered = contacts.filter(
    (c) =>
      c.nome.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.tipoVeiculo.toLowerCase().includes(search.toLowerCase())
  );

  const unread = contacts.filter((c) => !c.lido).length;

  return (
    <div className="space-y-5 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">
            Contatos
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            {total} total · {unread} não lidos
          </p>
        </div>
        {unread > 0 && (
          <button
            onClick={() =>
              contacts
                .filter((c) => !c.lido)
                .forEach((c) => markRead(c.id, true))
            }
            className="flex items-center gap-2 text-sm font-medium text-primary
                       hover:text-primary/80 transition-colors"
          >
            <CheckCheck className="w-4 h-4" />
            Marcar todos como lidos
          </button>
        )}
      </div>

      {/* Busca */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar por nome, e-mail ou veículo..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="form-input pl-10"
        />
      </div>

      {/* Tabela */}
      <Card className="overflow-hidden">
        {loading ? (
          <CardContent className="flex items-center justify-center py-16 text-muted-foreground">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            Carregando contatos...
          </CardContent>
        ) : filtered.length === 0 ? (
          <CardContent className="py-16 text-center text-muted-foreground">
            <MessageSquare className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm">
              {search ? "Nenhum contato encontrado." : "Nenhum contato recebido ainda."}
            </p>
          </CardContent>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Nome / Empresa
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">
                    Veículo
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden lg:table-cell">
                    Data
                  </th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((contact) => (
                  <tr
                    key={contact.id}
                    className={cn(
                      "hover:bg-muted/30 transition-colors cursor-pointer",
                      !contact.lido && "bg-primary/5"
                    )}
                    onClick={() => {
                      setSelected(contact);
                      if (!contact.lido) markRead(contact.id, true);
                    }}
                  >
                    <td className="px-4 py-3">
                      <div
                        className={cn(
                          "w-2.5 h-2.5 rounded-full",
                          contact.lido ? "bg-border" : "bg-accent"
                        )}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <p className={cn("font-medium text-foreground", !contact.lido && "text-primary")}>
                        {contact.nome}
                      </p>
                      {contact.empresa && (
                        <p className="text-xs text-muted-foreground">{contact.empresa}</p>
                      )}
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell text-foreground/70">
                      {contact.tipoVeiculo}
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell text-muted-foreground text-xs">
                      {new Date(contact.createdAt).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div
                        className="flex items-center gap-1 justify-end"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() => {
                            setSelected(contact);
                            if (!contact.lido) markRead(contact.id, true);
                          }}
                          className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-muted transition-colors"
                          title="Ver mensagem"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteContact(contact.id)}
                          className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                          title="Deletar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Modal de detalhe */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <Card
            className="w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header do modal */}
            <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b border-border">
              <CardTitle className="text-lg">{selected.nome}</CardTitle>
              <button
                onClick={() => setSelected(null)}
                className="p-2 rounded-lg text-muted-foreground hover:bg-muted transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </CardHeader>

            {/* Dados do contato */}
            <CardContent className="space-y-4 pt-5">
              <div className="grid grid-cols-2 gap-3 text-sm">
                {selected.empresa && (
                  <div className="col-span-2">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">
                      Empresa
                    </p>
                    <p className="font-medium text-foreground">{selected.empresa}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">
                    Telefone
                  </p>
                  <a
                    href={`tel:${selected.telefone}`}
                    className="font-medium text-primary hover:text-primary/80 flex items-center gap-1"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    {selected.telefone}
                  </a>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">
                    E-mail
                  </p>
                  <a
                    href={`mailto:${selected.email}`}
                    className="font-medium text-primary hover:text-primary/80 flex items-center gap-1 break-all"
                  >
                    <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                    {selected.email}
                  </a>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">
                    Veículo
                  </p>
                  <p className="font-medium text-foreground">{selected.tipoVeiculo}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">
                    Recebido em
                  </p>
                  <p className="font-medium text-foreground">
                    {new Date(selected.createdAt).toLocaleString("pt-BR")}
                  </p>
                </div>
                {selected.comoConheceu && (
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">
                      Como nos conheceu
                    </p>
                    <p className="font-medium text-foreground">{selected.comoConheceu}</p>
                  </div>
                )}
              </div>

              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
                  Mensagem
                </p>
                <div className="bg-muted rounded-lg p-4 text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">
                  {selected.mensagem}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <a
                  href={`https://wa.me/55${selected.telefone.replace(/\D/g, "")}?text=Ol%C3%A1%20${encodeURIComponent(selected.nome)}%2C%20recebemos%20seu%20contato!`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-accent flex-1 justify-center text-sm"
                >
                  Responder no WhatsApp
                </a>
                <button
                  onClick={() => {
                    deleteContact(selected.id);
                    setSelected(null);
                  }}
                  className="p-2.5 rounded-lg border border-destructive/30 text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
