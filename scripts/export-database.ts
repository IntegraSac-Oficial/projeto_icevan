import { execSync } from 'child_process';
import { writeFileSync } from 'fs';

async function exportDatabase() {
  console.log('🔄 Exportando banco de dados local...');
  
  try {
    // Configurações do banco local
    const localConfig = {
      host: 'localhost',
      port: '3307',
      user: 'root',
      password: 'icevans123',
      database: 'icevans'
    };

    // Comando mysqldump
    const dumpCommand = `mysqldump -h ${localConfig.host} -P ${localConfig.port} -u ${localConfig.user} -p${localConfig.password} ${localConfig.database}`;
    
    console.log('📤 Executando mysqldump...');
    const dumpData = execSync(dumpCommand, { encoding: 'utf8', maxBuffer: 50 * 1024 * 1024 }); // 50MB buffer
    
    // Salva o dump em arquivo
    const filename = `database-dump-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.sql`;
    writeFileSync(filename, dumpData);
    
    console.log(`✅ Dump salvo em: ${filename}`);
    console.log(`📊 Tamanho do arquivo: ${(dumpData.length / 1024 / 1024).toFixed(2)} MB`);
    
    return filename;
  } catch (error) {
    console.error('❌ Erro ao exportar banco:', error);
    throw error;
  }
}

// Executa se chamado diretamente
if (require.main === module) {
  exportDatabase().catch(console.error);
}

export { exportDatabase };