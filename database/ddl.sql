-- Authors: Chanse Syres & Devon Hebenton
-- Group Number: 202
-- Date: 02-08-2024
-- Description: CS 340 Military Munitions Inventory Tracking db project

-- Disable foreign key checks to avoid issues while creating tables
SET FOREIGN_KEY_CHECKS=0;
SET AUTOCOMMIT = 0;

-- Drop tables if they exist to prevent errors on import
DROP TABLE IF EXISTS `PersonnelMunitions`;
DROP TABLE IF EXISTS `BaseMunitions`;
DROP TABLE IF EXISTS `MunitionTransactions`;
DROP TABLE IF EXISTS `MunitionsOrders`;
DROP TABLE IF EXISTS `Personnel`;
DROP TABLE IF EXISTS `Bases`;
DROP TABLE IF EXISTS `Munitions`;
DROP TABLE IF EXISTS `MilitaryBranches`;

-- DDL for Military Branches
CREATE TABLE MilitaryBranches (
    branchId INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    PRIMARY KEY (branchId)
);

-- DDL for Bases
CREATE TABLE Bases (
    baseId INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    location VARCHAR(100) DEFAULT NULL,
    branchId INT,
    PRIMARY KEY (baseId),
    CONSTRAINT fk_bases_branches FOREIGN KEY (branchId) REFERENCES MilitaryBranches(branchId)
);

-- DDL for Munitions
CREATE TABLE Munitions (
    munitionId INT NOT NULL AUTO_INCREMENT,
    type VARCHAR(20) NOT NULL,
    specs TEXT,
    quantity INT DEFAULT NULL,
    PRIMARY KEY (munitionId)
);

-- DDL for Personnel
CREATE TABLE Personnel (
    personnelId INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    rank VARCHAR(100) DEFAULT NULL,
    role VARCHAR(100) DEFAULT NULL,
    baseId INT NOT NULL,
    PRIMARY KEY (personnelId),
    CONSTRAINT fk_personnel_bases FOREIGN KEY (baseId) REFERENCES Bases(baseId)
);

-- DDL for Munitions Orders
CREATE TABLE MunitionsOrders (
    orderId INT NOT NULL AUTO_INCREMENT,
    dateOrdered DATETIME NOT NULL,
    quantity INT NOT NULL,
    munitionId INT NOT NULL,
    baseId INT NOT NULL,
    PRIMARY KEY (orderId),
    CONSTRAINT fk_munitions_orders_munitions FOREIGN KEY (munitionId) REFERENCES Munitions(munitionId),
    CONSTRAINT fk_munitions_orders_bases FOREIGN KEY (baseId) REFERENCES Bases(baseId)
);

-- DDL for Munition Transactions
CREATE TABLE MunitionTransactions (
    transactionId INT NOT NULL AUTO_INCREMENT,
    date DATETIME NOT NULL,
    type VARCHAR(20) NOT NULL,
    quantity INT NOT NULL,
    munitionId INT NOT NULL,
    baseId INT NOT NULL,
    PRIMARY KEY (transactionId),
    CONSTRAINT fk_munition_transactions_munitions FOREIGN KEY (munitionId) REFERENCES Munitions(munitionId),
    CONSTRAINT fk_munition_transactions_bases FOREIGN KEY (baseId) REFERENCES Bases(baseId)
);

-- DDL for Base Munitions (Junction Table)
CREATE TABLE BaseMunitions (
    baseId INT NOT NULL,
    munitionId INT NOT NULL,
    quantity INT DEFAULT NULL,
    PRIMARY KEY (baseId, munitionId),
    CONSTRAINT fk_base_munitions_bases FOREIGN KEY (baseId) REFERENCES Bases(baseId),
    CONSTRAINT fk_base_munitions_munitions FOREIGN KEY (munitionId) REFERENCES Munitions(munitionId)
);

-- DDL for Personnel Munitions (Junction Table)
CREATE TABLE PersonnelMunitions (
    personnelId INT NOT NULL,
    munitionId INT NOT NULL,
    responsibilityType VARCHAR(100) DEFAULT NULL,
    PRIMARY KEY (personnelId, munitionId),
    CONSTRAINT fk_personnel_munitions_personnel FOREIGN KEY (personnelId) REFERENCES Personnel(personnelId),
    CONSTRAINT fk_personnel_munitions_munitions FOREIGN KEY (munitionId) REFERENCES Munitions(munitionId)
);


-- Inserting sample data into MilitaryBranches
INSERT INTO MilitaryBranches (name) VALUES 
('Army'), 
('Marines'),
('Navy'), 
('Air Force'),
('Space Force');


-- Inserting sample data into Bases
INSERT INTO Bases (name, location, branchId) VALUES 
('Fort Bragg', 'North Carolina', 1), 
('Camp Pendleton', 'California', 2), 
('Edwards AFB', 'California', 3),
('Naval Base San Diego', 'California', 4),
('Andrews Air Force Base', 'Maryland', 5);

-- Inserting sample data into Munitions
INSERT INTO Munitions (type, specs, quantity) VALUES 
('missile', 'Long-range ballistic missile', 500),
('bullet', '9mm Parabellum', 10000),
('grenade', 'M67 fragmentation grenade', 1000);


-- Inserting sample data into Personnel
INSERT INTO Personnel (name, rank, role, baseId) VALUES 
('John Doe', 'Captain', 'Inventory Manager', 1),
('Jane Smith', 'Lieutenant', 'Logistics Officer', 2),
('Alex Johnson', 'Major', 'Logistics Coordinator', 3);

-- Inserting sample data into MunitionsOrders
INSERT INTO MunitionsOrders (dateOrdered, quantity, munitionId, baseId) VALUES 
(NOW(), 10, 1, 1),
(NOW(), 200, 2, 2);

-- Inserting sample data into MunitionTransactions
INSERT INTO MunitionTransactions (date, type, quantity, munitionId, baseId) VALUES 
(NOW(), 'Issuance', 5, 1, 1), 
(NOW(), 'Transfer', 100, 2, 2);

-- Inserting sample data into BaseMunitions
INSERT INTO BaseMunitions (baseId, munitionId, quantity) VALUES 
(1, 1, 100),
(1, 2, 150),
(2, 1, 200),
(2, 3, 300),
(3, 2, 400),
(3, 3, 500);

-- Inserting sample data into PersonnelMunitions
INSERT INTO PersonnelMunitions (personnelId, munitionId, responsibilityType) VALUES 
(1, 1, 'maintenance'),
(2, 2, 'operation'),
(3, 3, 'inspection');

-- Re-enable foreign key checks and commit the transaction
SET FOREIGN_KEY_CHECKS=1;
COMMIT;