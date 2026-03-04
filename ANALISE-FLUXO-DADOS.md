# Análise do Fluxo de Dados: Admin → Site

## 🔍 Problema Identificado

O site mostra informações vazias inicialmente porque há **dois fluxos de dados diferentes**:

### ❌ Fluxo Atual (Problemático)

```
1. Página carrega (Server-Side) → Busca dados do banco ✅
2. Componentes Client (Header/Footer) → Estado inicial vazio ❌
3. useEffect executa → Faz fetch para API ⏱️
4. Dados chegam → Atualiza estado ✅
```

**Resultado**: Flash de conteúdo vazio entre os passos 2 e 4.

## 📊 Componentes Afetados

### 1. Header (`components/Header.tsx`)
```typescript
// Estado inicial VAZIO
const [logoSrc, setLogoSrc] = useState("/images/logo/logo-white.svg");
const [headerTelefone, setHeaderTelefone] = useState(""); // ❌ VAZIO
const [whatsappNumero, setWhatsappNumero] = useState(""); // ❌ VAZIO

// Depois faz fetch
useEffect(() => {
  fetch("/api/admin/settings")
    .then(res => res.json())
    .then(data => {
      setHeaderTelefone(data.header_telefone || "");
      setWhatsappNumero(data.empresa_whatsapp_numero || "");
    });
}, []);
```

### 2. Footer (`components/Footer.tsx`)
```typescript
// Estado inicial VAZIO
const [logoSrc, setLogoSrc] = useState("/images/logo/logo-white.svg");
const [nomeEmpresa, setNomeEmpresa] = useState(""); // ❌ VAZIO
const [whatsappNumero, setWhatsappNumero] = useState(""); // ❌ VAZIO
const [textos, setTextos] = useState({
  descricao: "", // ❌ VAZIO
  endereco: "",  // ❌ VAZIO
  telefone: "",  // ❌ VAZIO
  // ...
});

// Depois faz fetch
useEffect(() => {
  fetch("/api/admin/settings")
    .then(res => res.json())
    .then(data => {
      setNomeEmpresa(data.empresa_nome || "");
      setTextos({ ... });
    });
}, []);
```

## ✅ Solução: Server-Side Props

### Opção 1: Passar dados via props (Recomendado)

**Layout.tsx** já busca os dados:
```typescript
export default async function RootLayout({ children }) {
  const config = await getEmpresaConfig(); // ✅ Já busca do banco
  
  return (
    <html>
      <body>
        <Header config={config} /> {/* ✅ Passa dados */}
        {children}
        <Footer config={config} /> {/* ✅ Passa dados */}
      </body>
    </html>
  );
}
```

**Header.tsx** recebe props:
```typescript
export function Header({ config }: { config: EmpresaConfig }) {
  // ✅ Estado inicial com dados do servidor
  const [headerTelefone] = useState(config.telefone);
  const [whatsappNumero] = useState(config.whatsappNumero);
  
  // Não precisa mais de useEffect para buscar dados iniciais!
}
```

### Opção 2: Usar Context API

```typescript
// app/layout.tsx
const ConfigContext = createContext<EmpresaConfig | null>(null);

export default async function RootLayout({ children }) {
  const config = await getEmpresaConfig();
  
  return (
    <ConfigContext.Provider value={config}>
      <Header />
      {children}
      <Footer />
    </ConfigContext.Provider>
  );
}

// components/Header.tsx
export function Header() {
  const config = useContext(ConfigContext);
  // ✅ Dados disponíveis imediatamente
}
```

## 🎯 Implementação Recomendada

Vou implementar a **Opção 1** porque é mais simples e performática:

1. ✅ `layout.tsx` já busca `getEmpresaConfig()`
2. ✅ Passar `config` como prop para Header e Footer
3. ✅ Remover `useState` vazio e `useEffect` de fetch inicial
4. ✅ Manter `useEffect` apenas para escutar eventos de atualização do admin

## 📝 Arquivos a Modificar

1. `app/layout.tsx` - Passar props
2. `components/Header.tsx` - Receber props e remover fetch inicial
3. `components/Footer.tsx` - Receber props e remover fetch inicial

## 🔄 Fluxo Corrigido

```
1. Página carrega (Server-Side) → Busca dados do banco ✅
2. Layout passa dados para Header/Footer via props ✅
3. Componentes renderizam com dados corretos ✅
4. useEffect escuta eventos de atualização do admin ✅
```

**Resultado**: Sem flash de conteúdo vazio! 🎉
