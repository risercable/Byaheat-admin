--liquibase formatted sql
--changeset riserc:car-table
ALTER TABLE `car` ADD `carColor` VARCHAR(10) NOT NULL AFTER `carType`;

ALTER TABLE `car` CHANGE `carDriver` `carDriver` VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL;


--rollback ALTER TABLE car DROP COLUMN carColor;
--rollback ALTER TABLE car MODIFY carDriver VARCHAR(50) NOT NULL;

