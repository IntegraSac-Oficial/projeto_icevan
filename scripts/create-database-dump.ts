import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';

const execAsync = promisify(exec);

async function createDatabaseDump() {
  try {
    console.log('🔄 Criando dump do banco de dados...');
    
    // Comando para criar o dump
    const dumpCommand = `mysqldump --host=localhost --port=3306 --user=root --password=root --databases icevan_db --routines --triggers --single-transaction`;
    
    const { stdout, stderr } = await execAsync(dumpCommand);
    
    if (stderr && !stderr.includes('Warning')) {
      console.error('❌ Erro ao criar dump:', stderr);
      return;
    }
    
    // Salva o dump completo
    const dumpPath = path.join(process.cwd(), 'database-dump.sql');
    fs.writeFileSync(dumpPath, stdout);
    
    console.log('✅ Dump criado:', dumpPath);
    console.log('📊 Tamanho do arquivo:', (fs.statSync(dumpPath).size / 1024 / 1024).toFixed(2), 'MB');
    
    // Agora vamos dividir o arquivo em partes menores
    await splitDatabaseFile(dumpPath);
    
  } catch (error) {
    console.error('❌ Erro:', error);
  }
}

async function splitDatabaseFile(filePath: string) {
  console.log('🔄 Dividindo arquivo em partes menores...');
  
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  
  const maxLinesPerFile = 5000; // Aproximadamente 2-4MB por arquivo
  let currentPart = 1;
  let currentLines: string[] = [];
  
  // Cabeçalho comum para todos os arquivos
  const header = [
    '-- MySQL dump criado automaticamente',
    '-- Host: localhost    Database: icevan_db',
    '-- ------------------------------------------------------',
    '',
    'SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT;',
    'SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS;',
    'SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION;',
    'SET NAMES utf8mb4;',
    'SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;',
    'SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;',
    'SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE=\'NO_AUTO_VALUE_ON_ZERO\';',
    'SET @OLD_TIME_ZONE=@@TIME_ZONE, TIME_ZONE=\'+00:00\';',
    ''
  ];
  
  // Rodapé comum para todos os arquivos
  const footer = [
    '',
    'SET TIME_ZONE=@OLD_TIME_ZONE;',
    'SET SQL_MODE=@OLD_SQL_MODE;',
    'SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;',
    'SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;',
    'SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT;',
    'SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS;',
    'SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION;'
  ];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    currentLines.push(line);
    
    // Se chegou no limite de linhas ou é a última linha
    if (currentLines.length >= maxLinesPerFile || i === lines.length - 1) {
      const partFileName = `database-part${currentPart.toString().padStart(2, '0')}.sql`;
      const partPath = path.join(process.cwd(), partFileName);
      
      // Monta o conteúdo do arquivo
      const partContent = [
        ...header,
        ...currentLines,
        ...footer
      ].join('\n');
      
      fs.writeFileSync(partPath, partContent);
      
      const sizeInMB = (fs.statSync(partPath).size / 1024 / 1024).toFixed(2);
      console.log(`✅ Criado: ${partFileName} (${sizeInMB} MB)`);
      
      currentPart++;
      currentLines = [];
    }
  }
  
  console.log(`\n🎉 Banco dividido em ${currentPart - 1} partes!`);
  console.log('\n📋 Para importar no phpMyAdmin do Coolify:');
  console.log('1. Acesse: http://phpmyadmin-e4ksosoo8kkws0ock84occ48.192.168.100.218.sslip.io');
  console.log('2. Login: root');
  console.log('3. Password: SOl5h6wJlLlJbDwkwySCP5vgbNhGlj9voECSQh9XSvKu4qipGlp5ZVXK81GLFVg5');
  console.log('4. Selecione o banco "icevan_db"');
  console.log('5. Vá na aba "Importar"');
  console.log('6. Importe os arquivos NA ORDEM:');
  
  for (let i = 1; i < currentPart; i++) {
    const fileName = `database-part${i.toString().padStart(2, '0')}.sql`;
    console.log(`   - ${fileName}`);
  }
}

// Executa o script
createDatabaseDump();