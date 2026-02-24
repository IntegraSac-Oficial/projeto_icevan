import { NextRequest, NextResponse } from "next/server";
import { readdir } from "fs/promises";

export const dynamic = "force-dynamic";
import { writeFile, mkdir } from "fs/promises";
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
  "images/aplicacoes/van-ducato",
  "images/aplicacoes/van-sprinter",
  "images/aplicacoes/van-master",
  "images/aplicacoes/expert-porta-frigorifica",
  "images/aplicacoes/fiorino-porta-frigorifica",
];

const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".svg", ".gif"];

/** GET /api/admin/images?folder=images/hero */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const folder = searchParams.get("folder") ?? "images/fotos-servicos";

  if (!ALLOWED_FOLDERS.includes(folder)) {
    return NextResponse.json({ error: "Pasta não permitida" }, { status: 400 });
  }

  const dirPath = path.join(PUBLIC_DIR, folder);

  try {
    const files = await readdir(dirPath);
    const timestamp = Date.now(); // Timestamp para cache-busting
    const images = files
      .filter((f) => ALLOWED_EXTENSIONS.includes(path.extname(f).toLowerCase()))
      .sort((a, b) => a.localeCompare(b)) // Ordenar alfabeticamente
      .map((f) => ({
        filename: f,
        url: `/${folder}/${f}`,
        folder,
        timestamp, // Adiciona timestamp para forçar reload
      }));
    return NextResponse.json({ images, folders: ALLOWED_FOLDERS });
  } catch {
    return NextResponse.json({ images: [], folders: ALLOWED_FOLDERS });
  }
}

/** POST /api/admin/images — Upload de imagem
 *  FormData: file, folder, saveas? (nome do arquivo a sobrescrever)
 */
export async function POST(request: NextRequest) {
  console.log('');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('📥 API: POST /api/admin/images');
  console.log('═══════════════════════════════════════════════════════════');
  
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const folder = formData.get("folder") as string | null;
    const saveas = (formData.get("saveas") as string | null)?.trim() || null;

    console.log('📦 Dados recebidos:');
    console.log('   - Arquivo:', file?.name, file ? `(${(file.size / 1024).toFixed(2)} KB)` : '(ausente)');
    console.log('   - Pasta:', folder || '(ausente)');
    console.log('   - Salvar como:', saveas || '(não especificado - usar nome original)');
    console.log('');

    if (!file || !folder) {
      console.error('❌ Validação falhou: arquivo ou pasta ausente');
      return NextResponse.json({ error: "Arquivo e pasta são obrigatórios" }, { status: 400 });
    }

    if (!ALLOWED_FOLDERS.includes(folder)) {
      console.error('❌ Validação falhou: pasta não permitida:', folder);
      console.error('   Pastas permitidas:', ALLOWED_FOLDERS.join(', '));
      return NextResponse.json({ error: "Pasta não permitida" }, { status: 400 });
    }

    let safeName: string;

    if (saveas) {
      // Modo substituição: usa o nome fornecido
      safeName = saveas;
      console.log('🔄 Modo: SUBSTITUIÇÃO');
      console.log('📝 Nome a ser usado:', safeName);
      const ext = path.extname(safeName).toLowerCase();
      console.log('📎 Extensão:', ext);
      if (!ALLOWED_EXTENSIONS.includes(ext)) {
        console.error('❌ Validação falhou: extensão não permitida:', ext);
        console.error('   Extensões permitidas:', ALLOWED_EXTENSIONS.join(', '));
        return NextResponse.json({ error: "Formato de arquivo não permitido" }, { status: 400 });
      }
    } else {
      // Modo upload normal: adiciona prefixo numérico automaticamente
      const ext = path.extname(file.name).toLowerCase();
      console.log('📤 Modo: UPLOAD NOVO');
      console.log('📎 Extensão:', ext);
      if (!ALLOWED_EXTENSIONS.includes(ext)) {
        console.error('❌ Validação falhou: extensão não permitida:', ext);
        console.error('   Extensões permitidas:', ALLOWED_EXTENSIONS.join(', '));
        return NextResponse.json({ error: "Formato de arquivo não permitido" }, { status: 400 });
      }
      
      // Busca arquivos existentes para determinar a próxima posição
      const dirPath = path.join(PUBLIC_DIR, folder);
      await mkdir(dirPath, { recursive: true });
      
      let existingFiles: string[] = [];
      try {
        existingFiles = await readdir(dirPath);
        existingFiles = existingFiles
          .filter((f) => ALLOWED_EXTENSIONS.includes(path.extname(f).toLowerCase()))
          .sort((a, b) => a.localeCompare(b));
      } catch {
        // Diretório não existe ainda, será criado
      }
      
      const nextPosition = existingFiles.length + 1;
      const positionPrefix = String(nextPosition).padStart(2, '0');
      
      // Remove extensão e qualquer prefixo numérico existente do nome original
      const originalNameWithoutExt = file.name.replace(/\.[^/.]+$/, '');
      const cleanName = originalNameWithoutExt.replace(/^\d+-/, '');
      
      safeName = `${positionPrefix}-${cleanName}${ext}`;
      
      console.log('📝 Arquivos existentes:', existingFiles.length);
      console.log('📍 Próxima posição:', nextPosition);
      console.log('🔢 Prefixo:', positionPrefix + '-');
      console.log('📝 Nome limpo:', cleanName);
      console.log('📝 Nome final:', safeName);
    }

    const dirPath = path.join(PUBLIC_DIR, folder);
    console.log('');
    console.log('📁 Criando diretório (se não existir):', dirPath);
    await mkdir(dirPath, { recursive: true });
    console.log('✅ Diretório pronto');

    const filePath = path.join(dirPath, safeName);
    console.log('');
    console.log('💾 Salvando arquivo em:', filePath);
    
    const buffer = Buffer.from(await file.arrayBuffer());
    console.log('📊 Buffer criado:', buffer.length, 'bytes');
    
    await writeFile(filePath, buffer);
    
    const timestamp = Date.now();
    const resultUrl = `/${folder}/${safeName}`;
    
    console.log('');
    console.log('✅✅✅ ARQUIVO SALVO COM SUCESSO! ✅✅✅');
    console.log('🌐 URL:', resultUrl);
    console.log('📝 Nome do arquivo:', safeName);
    console.log('⏰ Timestamp:', timestamp);
    console.log('═══════════════════════════════════════════════════════════');
    console.log('');

    return NextResponse.json({
      ok: true,
      url: resultUrl,
      filename: safeName,
      timestamp,
    });
  } catch (error) {
    console.error('');
    console.error('❌❌❌ ERRO NO UPLOAD ❌❌❌');
    console.error('Tipo:', error instanceof Error ? error.name : typeof error);
    console.error('Mensagem:', error instanceof Error ? error.message : String(error));
    console.error('Stack:', error instanceof Error ? error.stack : 'N/A');
    console.error('═══════════════════════════════════════════════════════════');
    console.error('');
    return NextResponse.json({ error: "Erro no upload", details: String(error) }, { status: 500 });
  }
}
