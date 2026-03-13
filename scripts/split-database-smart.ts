import { readFileSync, writeFileSync } from 'fs';

function splitDatabaseSmart() {
  console.log('🔄 Dividindo arquivo de banco por tamanho...');
  
  const content = readFileSync('database-dump.sql', 'utf8');
  const lines = content.split('\n');
  
  console.log(`📊 Total de linhas: ${lines.length}`);
  console.log(`📊 Tamanho total: ${(content.length / 1024 / 1024).toFixed(2)} MB`);
  
  // Divide em partes de no máximo 2MB cada
  const maxSizeBytes = 2 * 1024 * 1024; // 2MB
  const parts = [];
  let currentPart = [];
  let currentSize = 0;
  
  for (const line of lines) {
    const lineSize = Buffer.byteLength(line + '\n', 'utf8');
    
    if (currentSize + lineSize > maxSizeBytes && currentPart.length > 0) {
      // Salva a parte atual e inicia uma nova
      parts.push(currentPart.join('\n'));
      currentPart = [line];
      currentSize = lineSize;
    } else {
      currentPart.push(line);
      currentSize += lineSize;
    }
  }
  
  // Adiciona a última parte
  if (currentPart.length > 0) {
    parts.push(currentPart.join('\n'));
  }
  
  console.log(`📦 Dividindo em ${parts.length} partes`);
  
  // Salva cada parte
  parts.forEach((part, index) => {
    const filename = `database-part${String(index + 1).padStart(2, '0')}.sql`;
    writeFileSync(filename, part);
    console.log(`✅ Criado: ${filename} (${(part.length / 1024).toFixed(1)} KB)`);
  });
  
  console.log('🎉 Divisão concluída!');
  console.log('\n📋 Para importar no phpMyAdmin do Coolify:');
  console.log('1. Acesse: http://phpmyadmin-e4ksosoo8kkws0ock84occ48.192.168.100.218.sslip.io');
  console.log('2. Login: root');
  console.log('3. Senha: SOl5h6wJlLlJbDwkwySCP5vgbNhGlj9voECSQh9XSvKu4qipGlp5ZVXK81GLFVg5');
  console.log('4. Selecione o banco "default"');
  console.log('5. Vá em "Importar" e importe cada arquivo na ordem (part01, part02, etc.)');
  console.log('6. ⚠️  IMPORTANTE: Marque "Permitir interrupção de importação" se disponível');
}

splitDatabaseSmart();