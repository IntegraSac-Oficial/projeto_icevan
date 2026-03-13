import { readFileSync, writeFileSync } from 'fs';

function splitDatabase() {
  console.log('🔄 Dividindo arquivo de banco em partes menores...');
  
  const content = readFileSync('database-dump.sql', 'utf8');
  const lines = content.split('\n');
  
  console.log(`📊 Total de linhas: ${lines.length}`);
  
  // Divide em partes de 5000 linhas cada
  const chunkSize = 5000;
  const chunks = [];
  
  for (let i = 0; i < lines.length; i += chunkSize) {
    chunks.push(lines.slice(i, i + chunkSize));
  }
  
  console.log(`📦 Dividindo em ${chunks.length} partes`);
  
  // Salva cada parte
  chunks.forEach((chunk, index) => {
    const filename = `database-part${index + 1}.sql`;
    const content = chunk.join('\n');
    writeFileSync(filename, content);
    console.log(`✅ Criado: ${filename} (${(content.length / 1024).toFixed(1)} KB)`);
  });
  
  console.log('🎉 Divisão concluída!');
  console.log('\n📋 Para importar no phpMyAdmin:');
  console.log('1. Acesse: http://phpmyadmin-e4ksosoo8kkws0ock84occ48.192.168.100.218.sslip.io');
  console.log('2. Login: root / SOl5h6wJlLlJbDwkwySCP5vgbNhGlj9voECSQh9XSvKu4qipGlp5ZVXK81GLFVg5');
  console.log('3. Selecione o banco "default"');
  console.log('4. Importe cada arquivo na ordem (part1, part2, etc.)');
}

splitDatabase();