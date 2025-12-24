--liquibase formatted sql
--changeset riserc:car-table
CREATE TABLE lakbay.car (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  carPlateNumber VARCHAR(20) NOT NULL,
  carBrand VARCHAR(20) NOT NULL,
  carModel VARCHAR(40) NOT NULL,
  carType VARCHAR(20) NOT NULL,
  carCapacity INT NOT NULL,
  carDriver VARCHAR(50) NOT NULL,
  customField VARCHAR(255) NULL,

  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id)
  ) ENGINE=InnoDB;

--rollback DROP TABLE car;
