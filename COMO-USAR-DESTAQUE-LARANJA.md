# 🎨 Como Usar Destaque em Laranja nos Títulos

## 📋 O Que É

Agora você pode controlar **qual parte do texto fica em laranja** diretamente pelo painel administrativo, sem precisar mexer no código!

## ✨ Como Funcionar

Use **colchetes** `[texto]` para marcar o que deve ficar em laranja (cor de destaque).

### Exemplos

#### Exemplo 1: Nome da Empresa
```
Por que escolher a [Ice Van]
```
**Resultado:** "Por que escolher a" fica em preto, "Ice Van" fica em laranja

#### Exemplo 2: Palavra-Chave
```
Nossas [Soluções] Completas
```
**Resultado:** "Nossas" fica em preto, "Soluções" fica em laranja, "Completas" fica em preto

#### Exemplo 3: Múltiplas Palavras
```
[Qualidade e Experiência] Comprovada
```
**Resultado:** "Qualidade e Experiência" fica em laranja, "Comprovada" fica em preto

#### Exemplo 4: Meio da Frase
```
Especialistas em [Isolamento Térmico] Veicular
```
**Resultado:** "Especialistas em" fica em preto, "Isolamento Térmico" fica em laranja, "Veicular" fica em preto

## 🎯 Onde Usar

Essa funcionalidade funciona em **todos os títulos de seções** que usam o componente `SectionTitle`:

### Páginas Públicas
- ✅ Página Inicial (diferenciais, aplicações, etc.)
- ✅ Página da Empresa
- ✅ Página de Contato
- ✅ Página de Serviços e Fotos
- ✅ Páginas de Aplicações

### Painel Admin
Você pode editar esses textos em:
- **Admin → Textos → Diferenciais**
- **Admin → Textos → Empresa**
- **Admin → Textos → Contato**
- **Admin → Textos → CTA**
- **Admin → Textos → Soluções**

## 📝 Regras

1. **Use colchetes simples**: `[texto]`
2. **Pode usar em qualquer parte do título**
3. **Pode usar espaços dentro dos colchetes**: `[Ice Van Isolamento]`
4. **Pode usar apenas uma vez por título** (ou várias, se necessário)
5. **Se não usar colchetes**, todo o texto fica em preto (padrão)

## 🔍 Exemplos Práticos

### Antes (Fixo no Código)
```
"Por que escolher a" + [automático] → "Ice Van"
```
❌ Não podia mudar a parte laranja

### Agora (Editável)
```
"Por que escolher a [Ice Van]"
"Por que escolher a [Nossa Empresa]"
"Por que [Confiar] na Ice Van"
```
✅ Você controla o que fica laranja!

## 🎨 Visualização

### Texto no Admin
```
Por que escolher a [Ice Van]
```

### Resultado no Site
<img src="exemplo-destaque.png" alt="Por que escolher a Ice Van" />

Onde:
- "Por que escolher a" = texto preto
- "Ice Van" = texto laranja (cor de destaque do tema)

## ⚙️ Como Editar

1. Acesse o painel admin: `http://localhost:3001/admin/login`
2. Vá em **Textos** → escolha a seção (ex: Diferenciais)
3. No campo **Título**, escreva o texto e coloque `[parte em laranja]` entre colchetes
4. Clique em **Salvar**
5. Recarregue a página pública para ver o resultado

## 💡 Dicas

- **Use para destacar**: Nome da empresa, palavras-chave, diferenciais
- **Não abuse**: Evite colocar muito texto em laranja, perde o efeito
- **Teste no site**: Sempre verifique como ficou na página pública
- **Mantenha coerência**: Use o mesmo padrão em todas as seções

## 🚀 Compatibilidade

- ✅ Funciona com a cor de destaque configurada no tema
- ✅ Mantém compatibilidade com código antigo
- ✅ Se não usar colchetes, funciona normalmente
- ✅ Suporta acentuação e caracteres especiais

## 📌 Observações

- A cor laranja é a `brand-accent` do tema (configurável em Aparência)
- Se mudar a cor do tema, o destaque muda automaticamente
- Os colchetes `[` `]` **não aparecem** no site, são apenas marcadores

---

**Agora você tem total controle sobre o destaque em laranja! 🎨**
