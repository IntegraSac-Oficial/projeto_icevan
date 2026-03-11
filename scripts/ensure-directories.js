const fs = require('fs');
const path = require('path');

// Diretórios necessários para as imagens
const requiredDirs = [
  'public/images/logo',
  'public/images/hero', 
  'public/images/aplicacoes',
  'public/images/empresa',
  'public/images/galeria',
  'public/images/formas-pagamento'
];

console.log('🔧 Verificando e criando diretórios necessários...');

requiredDirs.forEach(dir => {
  const fullPath = path.join(process.cwd(), dir);
  
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    console.log(`✅ Criado: ${dir}`);
  } else {
    console.log(`✓ Existe: ${dir}`);
  }
});

console.log('🎉 Todos os diretórios estão prontos!');