-- Migration para adicionar armazenamento de imagens no banco
-- Cria tabela para armazenar imagens como BLOB

CREATE TABLE `image_storage` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `filename` VARCHAR(255) NOT NULL,
  `original_name` VARCHAR(255) NOT NULL,
  `mime_type` VARCHAR(100) NOT NULL,
  `size` INT NOT NULL,
  `data` LONGBLOB NOT NULL,
  `category` VARCHAR(50) NOT NULL DEFAULT 'general',
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE INDEX `image_storage_filename_key` (`filename`),
  INDEX `image_storage_category_idx` (`category`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Adiciona campos para referenciar imagens armazenadas no banco
ALTER TABLE `hero_banners` 
ADD COLUMN `image_id` INT NULL,
ADD COLUMN `mobile_image_id` INT NULL,
ADD INDEX `hero_banners_image_id_idx` (`image_id`),
ADD INDEX `hero_banners_mobile_image_id_idx` (`mobile_image_id`);

-- Adiciona campos para outras tabelas que usam imagens
ALTER TABLE `gallery_photos` 
ADD COLUMN `image_id` INT NULL,
ADD INDEX `gallery_photos_image_id_idx` (`image_id`);