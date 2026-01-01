--liquibase formatted sql
--changeset riserc:driver-table
CREATE TABLE lakbay.driver (
                          id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
                          email VARCHAR(40) NOT NULL,
                          password VARCHAR(20) NOT NULL,
                          firstName VARCHAR(40) NOT NULL,
                          lastName VARCHAR(40) NOT NULL,
                          customField VARCHAR(255) NULL,

                          createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                          updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

                          PRIMARY KEY (id)
) ENGINE=InnoDB;

--rollback DROP TABLE driver;
