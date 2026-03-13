-- Script para remover sistema de imagens do banco
-- Execute este script diretamente no MySQL

USE icevans;

-- Primeiro, vamos ver quais constraints existem
SELECT 
    CONSTRAINT_NAME,
    TABLE_NAME,
    COLUMN_NAME,
    REFERENCED_TABLE_NAME,
    REFERENCED_COLUMN_NAME
FROM 
    INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
WHERE 
    TABLE_SCHEMA = 'icevans' 
    AND REFERENCED_TABLE_NAME IS NOT NULL;

-- Remove constraints se existirem
SET @sql = (SELECT IF(
    EXISTS(
        SELECT 1 FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
        WHERE CONSTRAINT_NAME = 'hero_banners_imageId_fkey' 
        AND TABLE_SCHEMA = 'icevans'
    ),
    'ALTER TABLE hero_banners DROP FOREIGN KEY hero_banners_imageId_fkey;',
    'SELECT "Constraint hero_banners_imageId_fkey não existe";'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql = (SELECT IF(
    EXISTS(
        SELECT 1 FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
        WHERE CONSTRAINT_NAME = 'hero_banners_mobileImageId_fkey' 
        AND TABLE_SCHEMA = 'icevans'
    ),
    'ALTER TABLE hero_banners DROP FOREIGN KEY hero_banners_mobileImageId_fkey;',
    'SELECT "Constraint hero_banners_mobileImageId_fkey não existe";'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql = (SELECT IF(
    EXISTS(
        SELECT 1 FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
        WHERE CONSTRAINT_NAME = 'gallery_photos_imageId_fkey' 
        AND TABLE_SCHEMA = 'icevans'
    ),
    'ALTER TABLE gallery_photos DROP FOREIGN KEY gallery_photos_imageId_fkey;',
    'SELECT "Constraint gallery_photos_imageId_fkey não existe";'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Remove colunas se existirem
SET @sql = (SELECT IF(
    EXISTS(
        SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_NAME = 'hero_banners' 
        AND COLUMN_NAME = 'imageId' 
        AND TABLE_SCHEMA = 'icevans'
    ),
    'ALTER TABLE hero_banners DROP COLUMN imageId;',
    'SELECT "Coluna imageId não existe em hero_banners";'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql = (SELECT IF(
    EXISTS(
        SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_NAME = 'hero_banners' 
        AND COLUMN_NAME = 'mobileImageId' 
        AND TABLE_SCHEMA = 'icevans'
    ),
    'ALTER TABLE hero_banners DROP COLUMN mobileImageId;',
    'SELECT "Coluna mobileImageId não existe em hero_banners";'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql = (SELECT IF(
    EXISTS(
        SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_NAME = 'gallery_photos' 
        AND COLUMN_NAME = 'imageId' 
        AND TABLE_SCHEMA = 'icevans'
    ),
    'ALTER TABLE gallery_photos DROP COLUMN imageId;',
    'SELECT "Coluna imageId não existe em gallery_photos";'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Remove tabela se existir
SET @sql = (SELECT IF(
    EXISTS(
        SELECT 1 FROM INFORMATION_SCHEMA.TABLES 
        WHERE TABLE_NAME = 'image_storage' 
        AND TABLE_SCHEMA = 'icevans'
    ),
    'DROP TABLE image_storage;',
    'SELECT "Tabela image_storage não existe";'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SELECT "✅ Script executado com sucesso!" as resultado;