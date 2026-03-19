"use client";

import { useState, useEffect } from "react";
import { Save, Loader2, CheckCircle, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const PAGES = [
  { slug: "/", label: "Home" },
  { slug: "/empresa", label: "Empresa" },
  { slug: "/aplicacoes", label: "Aplicações" },
  { slug: "/servicos-e-fotos", label: "Serviços e Fotos" },
  { slug: "/contato", label: "Contato" },
  { slug: "/fiorinos", label: "Fiorinos" },
  { slug: "/van-ducato", label: "Van Ducato" },
  { slug: "/van-sprinter", label: "Van Sprinter" },
  { slug: "/van-master", label: "Van Master" },
  { slug: "/expert-porta-frigorifica", label: "Expert c/ Porta Frigorífica" },
  { slug: "/isolamento-fiorino", label: "Isolamento Fiorino" },
];

interface StructuredData {
  organizationName: string;
  organizationDescription: string;
  businessType: string;
  streetAddress: string;
  addressLocality: string;
  addressRegion: string;
  postalCode: string;
  telephone: string;
  email: string;
  priceRange: string;
  servicesOffered: string;
}

interface SeoForm {
  metaTitulo: string;
  metaDescricao: string;
  ogImage: string;
}

export default function SeoPage() {
  const [forms, setForms] = useState<Record<string, SeoForm>>(
    Object.fromEntries(
      PAGES.map((p) => [
        p.slug,
        { metaTitulo: "", metaDescricao: "", ogImage: "" },
      ])
    )
  );
  const [savingSlug, setSavingSlug] = useState<string | null>(null);
  const [savedSlug, setSavedSlug] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorSlug, setErrorSlug] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  
  // Estado para dados estruturados
  const [structuredData, setStructuredData] = useState<StructuredData>({
    organizationName: "",
    organizationDescription: "",
    businessType: "AutoRepair",
    streetAddress: "",
    addressLocality: "",
    addressRegion: "",
    postalCode: "",
    telephone: "",
    email: "",
    priceRange: "$$",
    servicesOffered: "",
  });
  const [savingStructured, setSavingStructured] = useState(false);
  const [savedStructured, setSavedStructured] = useState(false);

  // Carregar dados existentes do banco
  useEffect(() => {
    const loadSeoData = async () => {
      try {
        const res = await fetch("/api/admin/seo");
        const data = await res.json();
        
        // Criar mapa de dados existentes
        const existingData: Record<string, SeoForm> = {};
        data.forEach((item: any) => {
          existingData[item.pageSlug] = {
            metaTitulo: item.metaTitulo || "",
            metaDescricao: item.metaDescricao || "",
            ogImage: item.ogImage || "",
          };
        });
        
        // Mesclar com formulários vazios (para páginas sem dados)
        setForms((prev) => {
          const updated = { ...prev };
          Object.keys(existingData).forEach((slug) => {
            if (updated[slug]) {
              updated[slug] = existingData[slug];
            }
          });
          return updated;
        });
        
        // Carregar dados estruturados
        const settingsRes = await fetch("/api/admin/settings");
        const settings = await settingsRes.json();
        
        if (settings.structured_data) {
          try {
            const parsed = JSON.parse(settings.structured_data);
            setStructuredData(parsed);
          } catch (e) {
            console.error("Erro ao parsear dados estruturados:", e);
          }
        }
      } catch (error) {
        console.error("Erro ao carregar dados de SEO:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadSeoData();
  }, []);

  const updateForm = (slug: string, field: keyof SeoForm, value: string) => {
    setForms((prev) => ({
      ...prev,
      [slug]: { ...prev[slug], [field]: value },
    }));
  };

  const saveSeo = async (slug: string) => {
    setSavingSlug(slug);
    setErrorSlug(null);
    try {
      const res = await fetch("/api/admin/seo", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pageSlug: slug, ...forms[slug] }),
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Erro ao salvar");
      }
      
      setSavedSlug(slug);
      setTimeout(() => setSavedSlug(null), 3000);
    } catch (error) {
      console.error("Erro ao salvar SEO:", error);
      setErrorSlug(slug);
      setErrorMessage(error instanceof Error ? error.message : "Erro ao salvar");
      setTimeout(() => {
        setErrorSlug(null);
        setErrorMessage("");
      }, 5000);
    } finally {
      setSavingSlug(null);
    }
  };

  const saveStructuredData = async () => {
    setSavingStructured(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: "structured_data",
          value: JSON.stringify(structuredData),
        }),
      });
      
      if (!res.ok) throw new Error("Erro ao salvar");
      
      setSavedStructured(true);
      setTimeout(() => setSavedStructured(false), 3000);
    } catch (error) {
      console.error("Erro ao salvar dados estruturados:", error);
      alert("Erro ao salvar dados estruturados");
    } finally {
      setSavingStructured(false);
    }
  };

  const updateStructuredData = (field: keyof StructuredData, value: string) => {
    setStructuredData((prev) => ({ ...prev, [field]: value }));
  };

  const titleLength = (slug: string) => forms[slug].metaTitulo.length;
  const descLength = (slug: string) => forms[slug].metaDescricao.length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-5 max-w-3xl">
      <div>
        <h1 className="text-2xl font-heading font-bold text-foreground">
          Configurações de SEO
        </h1>
        <p className="text-muted-foreground text-sm mt-0.5">
          Defina o título e a descrição de cada página para melhorar o posicionamento no Google
        </p>
      </div>

      {/* Seção de Dados Estruturados para IA */}
      <Card className="border-2 border-blue-200 bg-blue-50/30">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-500 rounded-lg">
              <Search className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-base">Dados Estruturados (Schema Markup)</CardTitle>
              <CardDescription className="text-xs mt-0.5">
                Informações para Google AI, Gemini e assistentes virtuais entenderem seu negócio
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="form-label text-xs">Nome da Empresa</label>
              <input
                type="text"
                value={structuredData.organizationName}
                onChange={(e) => updateStructuredData("organizationName", e.target.value)}
                placeholder="Ex: Ice Van Isolamento Térmico"
                className="form-input text-sm"
              />
            </div>
            
            <div className="col-span-2">
              <label className="form-label text-xs">Descrição do Negócio</label>
              <textarea
                value={structuredData.organizationDescription}
                onChange={(e) => updateStructuredData("organizationDescription", e.target.value)}
                placeholder="Breve descrição do que sua empresa faz"
                className="form-input text-sm resize-none"
                rows={2}
              />
            </div>
            
            <div>
              <label className="form-label text-xs">Tipo de Negócio</label>
              <select
                value={structuredData.businessType}
                onChange={(e) => updateStructuredData("businessType", e.target.value)}
                className="form-input text-sm"
              >
                <option value="AutoRepair">Oficina/Reparos Automotivos</option>
                <option value="AutomotiveBusiness">Negócio Automotivo</option>
                <option value="LocalBusiness">Negócio Local</option>
                <option value="ProfessionalService">Serviço Profissional</option>
              </select>
            </div>
            
            <div>
              <label className="form-label text-xs">Faixa de Preço</label>
              <select
                value={structuredData.priceRange}
                onChange={(e) => updateStructuredData("priceRange", e.target.value)}
                className="form-input text-sm"
              >
                <option value="$">$ (Econômico)</option>
                <option value="$$">$$ (Moderado)</option>
                <option value="$$$">$$$ (Alto)</option>
                <option value="$$$$">$$$$ (Premium)</option>
              </select>
            </div>
          </div>
          
          <div className="border-t pt-3">
            <p className="text-xs font-semibold text-gray-700 mb-2">Endereço</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="form-label text-xs">Rua e Número</label>
                <input
                  type="text"
                  value={structuredData.streetAddress}
                  onChange={(e) => updateStructuredData("streetAddress", e.target.value)}
                  placeholder="Ex: Rua Paratiji, 18B"
                  className="form-input text-sm"
                />
              </div>
              
              <div>
                <label className="form-label text-xs">Cidade</label>
                <input
                  type="text"
                  value={structuredData.addressLocality}
                  onChange={(e) => updateStructuredData("addressLocality", e.target.value)}
                  placeholder="Ex: São Paulo"
                  className="form-input text-sm"
                />
              </div>
              
              <div>
                <label className="form-label text-xs">Estado (sigla)</label>
                <input
                  type="text"
                  value={structuredData.addressRegion}
                  onChange={(e) => updateStructuredData("addressRegion", e.target.value)}
                  placeholder="Ex: SP"
                  className="form-input text-sm"
                  maxLength={2}
                />
              </div>
              
              <div>
                <label className="form-label text-xs">CEP</label>
                <input
                  type="text"
                  value={structuredData.postalCode}
                  onChange={(e) => updateStructuredData("postalCode", e.target.value)}
                  placeholder="Ex: 03702-000"
                  className="form-input text-sm"
                />
              </div>
              
              <div>
                <label className="form-label text-xs">Telefone</label>
                <input
                  type="text"
                  value={structuredData.telephone}
                  onChange={(e) => updateStructuredData("telephone", e.target.value)}
                  placeholder="Ex: (11) 2045-9999"
                  className="form-input text-sm"
                />
              </div>
              
              <div className="col-span-2">
                <label className="form-label text-xs">E-mail</label>
                <input
                  type="email"
                  value={structuredData.email}
                  onChange={(e) => updateStructuredData("email", e.target.value)}
                  placeholder="Ex: contato@icevan.com.br"
                  className="form-input text-sm"
                />
              </div>
            </div>
          </div>
          
          <div className="border-t pt-3">
            <label className="form-label text-xs">Serviços Oferecidos (separados por vírgula)</label>
            <textarea
              value={structuredData.servicesOffered}
              onChange={(e) => updateStructuredData("servicesOffered", e.target.value)}
              placeholder="Ex: Isolamento térmico, Refrigeração veicular, Adaptação de vans, Porta frigorífica"
              className="form-input text-sm resize-none"
              rows={2}
            />
          </div>
          
          <div className="bg-blue-100 border border-blue-300 rounded-lg p-3">
            <p className="text-xs text-blue-800 font-medium mb-1">💡 Para que serve?</p>
            <ul className="text-xs text-blue-700 space-y-0.5 list-disc list-inside">
              <li>Google AI e Gemini entendem melhor seu negócio</li>
              <li>Aparece em cards especiais no Google (Rich Snippets)</li>
              <li>Assistentes de voz (Alexa, Google) encontram você</li>
              <li>Melhora posicionamento em buscas locais</li>
            </ul>
          </div>
          
          {structuredData.organizationName && (
            <details className="bg-gray-50 border rounded-lg p-3">
              <summary className="text-xs font-semibold text-gray-700 cursor-pointer">
                🔍 Ver código JSON-LD (Schema Markup)
              </summary>
              <pre className="text-xs bg-gray-900 text-green-400 p-3 rounded mt-2 overflow-x-auto">
                {JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": structuredData.businessType,
                  "name": structuredData.organizationName,
                  "description": structuredData.organizationDescription,
                  "priceRange": structuredData.priceRange,
                  "address": {
                    "@type": "PostalAddress",
                    "streetAddress": structuredData.streetAddress,
                    "addressLocality": structuredData.addressLocality,
                    "addressRegion": structuredData.addressRegion,
                    "postalCode": structuredData.postalCode,
                    "addressCountry": "BR"
                  },
                  "telephone": structuredData.telephone,
                  "email": structuredData.email,
                  "hasOfferCatalog": {
                    "@type": "OfferCatalog",
                    "name": "Serviços",
                    "itemListElement": structuredData.servicesOffered.split(",").map((s, i) => ({
                      "@type": "Offer",
                      "itemOffered": {
                        "@type": "Service",
                        "name": s.trim()
                      },
                      "position": i + 1
                    }))
                  }
                }, null, 2)}
              </pre>
            </details>
          )}
          
          <button
            onClick={saveStructuredData}
            disabled={savingStructured}
            className="btn-primary text-sm py-2 w-full disabled:opacity-50"
          >
            {savingStructured ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : savedStructured ? (
              <CheckCircle className="w-4 h-4 text-green-400" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {savedStructured ? "Salvo!" : "Salvar Dados Estruturados"}
          </button>
        </CardContent>
      </Card>

      {PAGES.map((page) => {
        const form = forms[page.slug];
        const isSaving = savingSlug === page.slug;
        const isSaved = savedSlug === page.slug;
        const hasError = errorSlug === page.slug;
        const t = titleLength(page.slug);
        const d = descLength(page.slug);

        return (
          <Card key={page.slug}>
            <CardHeader className="pb-4 flex flex-row items-center gap-2 space-y-0">
              <div className="p-1.5 bg-primary/10 rounded-lg">
                <Search className="w-4 h-4 text-primary" />
              </div>
              <div>
                <CardTitle className="text-sm font-semibold">{page.label}</CardTitle>
                <CardDescription className="text-xs">{page.slug}</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Meta Título */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="form-label text-xs mb-0">Meta Título</label>
                  <span className={`text-xs ${t > 60 ? "text-red-500" : t > 50 ? "text-yellow-500" : "text-gray-400"}`}>
                    {t}/60
                  </span>
                </div>
                <input
                  type="text"
                  value={form.metaTitulo}
                  onChange={(e) => updateForm(page.slug, "metaTitulo", e.target.value)}
                  placeholder={`Ex: ${page.label} | Ice Van — Refrigeração para Transporte`}
                  className="form-input text-sm"
                  maxLength={70}
                />
              </div>

              {/* Meta Descrição */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="form-label text-xs mb-0">Meta Descrição</label>
                  <span className={`text-xs ${d > 160 ? "text-red-500" : d > 140 ? "text-yellow-500" : "text-gray-400"}`}>
                    {d}/160
                  </span>
                </div>
                <textarea
                  value={form.metaDescricao}
                  onChange={(e) => updateForm(page.slug, "metaDescricao", e.target.value)}
                  placeholder="Breve descrição da página (aparece no Google abaixo do título)"
                  className="form-input text-sm resize-none"
                  rows={2}
                  maxLength={180}
                />
              </div>

              {/* Preview snippet */}
              {(form.metaTitulo || form.metaDescricao) && (
                <div className="bg-muted rounded-lg p-3 border border-border">
                  <p className="text-xs text-muted-foreground mb-1.5 uppercase tracking-wider font-semibold">
                    Preview no Google
                  </p>
                  <p className="text-[#1a0dab] text-sm font-medium truncate">
                    {form.metaTitulo || "(sem título)"}
                  </p>
                  <p className="text-xs text-[#006621] mb-0.5">
                    icevanisolamento.com.br{page.slug}
                  </p>
                  <p className="text-xs text-gray-600 line-clamp-2">
                    {form.metaDescricao || "(sem descrição)"}
                  </p>
                </div>
              )}

              {/* Botão salvar */}
              <div className="flex items-center gap-3 pt-1">
                <button
                  onClick={() => saveSeo(page.slug)}
                  disabled={isSaving || (!form.metaTitulo && !form.metaDescricao)}
                  className="btn-primary text-sm py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : isSaved ? (
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {isSaved ? "Salvo!" : "Salvar"}
                </button>
                
                {hasError && (
                  <span className="text-xs text-red-500">
                    {errorMessage}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
