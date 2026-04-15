-- Script para criar a tabela de legendas de fotos das aplicações
-- Execute este script no banco de dados MySQL

CREATE TABLE IF NOT EXISTS `application_photo_captions` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `aplicacao` VARCHAR(191) NOT NULL COMMENT 'Slug da aplicação (ex: fiorinos, van-ducato)',
  `filename` VARCHAR(191) NOT NULL COMMENT 'Nome do arquivo da foto',
  `legenda` VARCHAR(191) NOT NULL DEFAULT '' COMMENT 'Texto que aparece no canto da foto',
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `application_photo_captions_aplicacao_filename_key` (`aplicacao`, `filename`),
  INDEX `idx_aplicacao` (`aplicacao`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Comentário da tabela
ALTER TABLE `application_photo_captions` 
COMMENT = 'Legendas personalizadas para fotos das galerias das aplicações';
