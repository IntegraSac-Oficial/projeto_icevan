import { NextRequest, NextResponse } from "next/server";
import { unlink } from "fs/promises";
import path from "path";

const PUBLIC_DIR = path.join(process.cwd(), "public");
const ALLOWED_FOLDERS = [
  "images/hero",
  "images/fotos-servicos",
  "images/empresa",
  "images/og",
  "images/logo",
  "images/formas-pagamento",
  "images/aplicacoes/fiorinos",
  "images/aplicacoes/isolamento-fiorino",
  "images/aplicacoes/van-ducato",
  "images/aplicacoes/van-sprinter",
  "images/aplicacoes/van-master",
  "images/aplicacoes/expert-porta-frigorifica",
  "images/aplicacoes/fiorino-porta-frigorifica",
];

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;
  const { searchParams } = new URL(request.url);
  const folder = searchParams.get("folder") ?? "";

  console.log('');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('🗑️  API: DELETE /api/admin/images/[filename]');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('📝 Arquivo:', filename);
  console.log('📁 Pasta:', folder);
  console.log('');

  if (!ALLOWED_FOLDERS.includes(folder)) {
    console.error('❌ Validação falhou: pasta não permitida:', folder);
    console.error('   Pastas permitidas:', ALLOWED_FOLDERS.join(', '));
    console.error('═══════════════════════════════════════════════════════════');
    console.error('');
    return NextResponse.json({ error: "Pasta não permitida" }, { status: 400 });
  }

  // Previne path traversal
  const safeName = path.basename(filename);
  console.log('🔒 Nome seguro (após basename):', safeName);
  
  const filePath = path.join(PUBLIC_DIR, folder, safeName);
  console.log('📂 Caminho completo:', filePath);
  console.log('📂 PUBLIC_DIR:', PUBLIC_DIR);

  // Garante que o arquivo está dentro de public/
  if (!filePath.startsWith(PUBLIC_DIR)) {
    console.error('');
    console.error('❌ SEGURANÇA: Tentativa de acesso fora de public/');
    console.error('   Caminho solicitado:', filePath);
    console.error('   Diretório permitido:', PUBLIC_DIR);
    console.error('═══════════════════════════════════════════════════════════');
    console.error('');
    return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
  }

  try {
    console.log('🗑️  Deletando arquivo...');
    
    // Aguarda um pouco para garantir que não há handles abertos
    await new Promise(resolve => setTimeout(resolve, 100));
    
    await unlink(filePath);
    console.log('');
    console.log('✅✅✅ ARQUIVO DELETADO COM SUCESSO! ✅✅✅');
    console.log('📝 Arquivo:', safeName);
    console.log('📁 Pasta:', folder);
    console.log('═══════════════════════════════════════════════════════════');
    console.log('');
    return NextResponse.json({ ok: true });
  } catch (error) {
    const err = error as NodeJS.ErrnoException;
    
    // Se o arquivo não existe, considera como sucesso (já foi deletado)
    if (err.code === 'ENOENT') {
      console.log('');
      console.log('⚠️  ARQUIVO JÁ NÃO EXISTE (considerando como sucesso)');
      console.log('📝 Arquivo:', safeName);
      console.log('📁 Pasta:', folder);
      console.log('═══════════════════════════════════════════════════════════');
      console.log('');
      return NextResponse.json({ ok: true, message: 'Arquivo já não existe' });
    }
    
    // Se o arquivo está em uso (EPERM, EBUSY), tenta novamente após delay
    if (err.code === 'EPERM' || err.code === 'EBUSY') {
      console.warn('');
      console.warn('⚠️  ARQUIVO EM USO - Tentando novamente após 500ms...');
      console.warn('');
      
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        await unlink(filePath);
        
        console.log('');
        console.log('✅✅✅ ARQUIVO DELETADO COM SUCESSO (2ª tentativa)! ✅✅✅');
        console.log('📝 Arquivo:', safeName);
        console.log('📁 Pasta:', folder);
        console.log('═══════════════════════════════════════════════════════════');
        console.log('');
        return NextResponse.json({ ok: true });
      } catch (retryError) {
        console.error('');
        console.error('❌ FALHA NA 2ª TENTATIVA');
        console.error('O arquivo pode estar bloqueado por outro processo.');
        console.error('Tente fechar o navegador ou reiniciar o servidor.');
        console.error('═══════════════════════════════════════════════════════════');
        console.error('');
        return NextResponse.json({ 
          ok: false, 
          error: "Arquivo está em uso e não pode ser deletado. Tente novamente em alguns segundos.",
          code: err.code
        }, { status: 423 }); // 423 Locked
      }
    }
    
    console.error('');
    console.error('❌❌❌ ERRO AO DELETAR ARQUIVO ❌❌❌');
    console.error('Tipo:', error instanceof Error ? error.name : typeof error);
    console.error('Mensagem:', error instanceof Error ? error.message : String(error));
    console.error('Código:', err.code);
    console.error('');
    console.error('Possíveis causas:');
    console.error('  - Arquivo não existe');
    console.error('  - Sem permissão para deletar');
    console.error('  - Arquivo está em uso por outro processo');
    console.error('═══════════════════════════════════════════════════════════');
    console.error('');
    return NextResponse.json({ 
      ok: false,
      error: "Arquivo não encontrado ou não pode ser deletado", 
      details: String(error),
      code: err.code
    }, { status: 404 });
  }
}
