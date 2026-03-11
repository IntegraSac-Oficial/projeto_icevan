# 🚨 PROBLEMA CRÍTICO: Imagens Perdidas no Deploy

## 🔍 Problema Identificado

**As imagens são perdidas a cada deploy porque não há volumes persistentes configurados!**

### O que acontece:
1. ✅ Upload funciona (salva no container temporário)
2. ❌ Deploy recria container → imagens são perdidas
3. ❌ `loadApplicationImages()` não encontra arquivos → imagens em branco

## 🔧 SOLUÇÕES

### **Solução 1: Configurar Volume no Coolify (URGENTE)**

**No painel do Coolify:**

1. Vá em **Applications** → Sua aplicação
2. Clique em **Storage** → **Add Volume**
3. Configure:
   - **Name**: `images-storage`
   - **Source**: `/data/icevan/images`
   - **Destination**: `/app/public/images`
   - **Type**: `bind`

### **Solução 2: Via Docker Labels (Alternativa)**

Adicionar no Coolify → **Advanced** → **Custom Docker Run Options**:
```
-v /data/icevan/images:/app/public/images
```

### **Solução 3: Variável de Ambiente**

No Coolify → **Environment Variables**:
```
COOLIFY_STORAGE_PATH=/data/icevan/images:/app/public/images
```

## ⚡ AÇÃO IMEDIATA

1. **Configure o volume no Coolify**
2. **Faça novo deploy**
3. **Re-upload das imagens que sumiram**

## 🔍 Como Verificar se Funcionou

Após configurar o volume:
1. Faça upload de uma imagem
2. Faça um novo deploy
3. Verifique se a imagem ainda está lá

## 📁 Estrutura de Pastas no Servidor

```
/data/icevan/images/
├── aplicacoes/
│   ├── fiorinos/
│   ├── van-ducato/
│   ├── van-sprinter/
│   └── ...
├── hero/
├── logo/
└── galeria/
```

## 🚨 URGENTE

**Este problema afeta TODAS as imagens do site!** Configure o volume imediatamente.