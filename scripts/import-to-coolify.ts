import { execSync } from 'child_process';
import { readFileSync } from 'fs';

async function importToCoolify() {
  console.log('🔄 Importando banco de dados para o Coolify...');
  
  try {
    // Configurações do banco no Coolify (baseado na resposta da API)
    const coolifyConfig = {
      host: '192.168.100.218', // IP do servidor Coolify
      port: '3306', // Porta padrão MySQL
      user: 'mysql',
      password: 'J8fQEcnmCdPm33UCLdIGZvBAGGsW9RyHHQx317PxX9VSfQUoPkRGUdXAfIzgjNzy',
      database: 'default'
    };

    console.log('📤 Importando dump para o Coolify...');
    console.log(`🎯 Servidor: ${coolifyConfig.host}:${coolifyConfig.port}`);
    console.log(`📊 Banco: ${coolifyConfig.database}`);
    
    // Comando para importar via mysql client
    const importCommand = `mysql -h ${coolifyConfig.host} -P ${coolifyConfig.port} -u ${coolifyConfig.user} -p${coolifyConfig.password} ${coolifyConfig.database} < database-dump.sql`;
    
    console.log('⚡ Executando importação...');
    execSync(importCommand, { stdio: 'inherit' });
    
    console.log('✅ Importação concluída com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro ao importar banco:', error);
    throw error;
  }
}

// Executa se chamado diretamente
if (require.main === module) {
  importToCoolify().catch(console.error);
}

export { importToCoolify };