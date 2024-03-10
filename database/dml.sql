-- Authors: Chanse Syres & Devon Hebenton
-- Group Number: 202
-- Date: 02-22-2024
-- Description: CS 340 Military Munitions Inventory Tracking db project

--Home Page:

--nothing (N/A)

-- Browse military branches sorted by branchID
SELECT branchID, name
FROM MILITARY_BRANCHES
ORDER BY branchID ASC;

-- Add military branch
INSERT INTO MILITARY_BRANCHES (name)
VALUES (:BranchNameInput);

-- Update military branch using ID
UPDATE MILITARY_BRANCHES
SET name = :NewBranchNameInput
WHERE branchID = :BranchIDInput;

-- Remove military branch using ID
DELETE FROM MILITARY_BRANCHES
WHERE branchID = :BranchIDInput;

--*********************************************
-- Bases Page:

-- Browse bases with JOIN to show branch name instead of branchID for user-friendliness, automatically sort by BaseID
SELECT BASES.baseID, BASES.name, BASES.location, MILITARY_BRANCHES.name AS branchName
FROM BASES
JOIN MILITARY_BRANCHES ON BASES.branchID = MILITARY_BRANCHES.branchID
ORDER BY BASES.baseID ASC;

-- Alternative: User can search by branch name to list all bases associated with branch
SELECT BASES.baseID, BASES.name, BASES.location, MILITARY_BRANCHES.name AS branchName
FROM BASES
JOIN MILITARY_BRANCHES ON BASES.branchID = MILITARY_BRANCHES.branchID
WHERE MILITARY_BRANCHES.name = :BranchNameInput
ORDER BY BASES.baseID ASC;

-- Insert base
INSERT INTO BASES (name, location, branchID)
VALUES (:BaseNameInput, :BaseLocationInput, :BranchIDInput);

-- Update base using baseID for precision
UPDATE BASES
SET name = :NewBaseNameInput, location = :NewBaseLocationInput, branchID = :NewBranchIDInput
WHERE baseID = :BaseIDInput;

-- Delete base using baseID
DELETE FROM BASES
WHERE baseID = :BaseIDInput;

--*********************************************
-- Munitions Page:

-- Automatically sorts munitions by munitionID
SELECT munitionID, type, specifications, quantity
FROM MUNITIONS
ORDER BY munitionID ASC;

-- Alternative: User can sort by munition type instead. (still sorts by munition ID secondarily)
SELECT munitionID, type, specifications, quantity
FROM MUNITIONS
ORDER BY type ASC, munitionID ASC;

-- Add munition
INSERT INTO MUNITIONS (type, specifications, quantity)
VALUES (:MunitionTypeInput, :SpecificationsInput, :QuantityInput);

-- Update munition using munitionID for precision
UPDATE MUNITIONS
SET type = :NewMunitionsTypeInput, specifications = :NewSpecificationsInput, quantity = :NewQuantityInput
WHERE munitionID = :MunitionIDInput;

-- Delete munition using munitionID for precision
DELETE FROM MUNITIONS
WHERE munitionID = :MunitionIDInput;

--*********************************************
-- Personnel Page:

-- Browse personnel with JOIN to show base name instead of baseID for user-friendliness.
SELECT PERSONNEL.personnelID, PERSONNEL.name, PERSONNEL.rank, PERSONNEL.role, BASES.name AS baseName
FROM PERSONNEL
JOIN BASES ON PERSONNEL.baseID = BASES.baseID
ORDER BY PERSONNEL.personnelID ASC;

-- Alternative: User can browse personnel by base ID (bring up what personnel are at a given base).
SELECT PERSONNEL.personnelID, PERSONNEL.name, PERSONNEL.rank, PERSONNEL.role, BASES.name AS baseName, PERSONNEL.baseID
FROM PERSONNEL
JOIN BASES ON PERSONNEL.baseID = BASES.baseID
ORDER BY PERSONNEL.baseID ASC, PERSONNEL.personnelID ASC;

-- Add personnel
INSERT INTO PERSONNEL (name, rank, role, baseID)
VALUES (:FullNameInput, :RankInput, :RoleInput, :BaseIDInput);

-- Update personnel using personnelID for precision
UPDATE PERSONNEL
SET name = :NewPersonFullNameInput, rank = :NewRankInput, role = :NewRoleInput, baseID = :NewBaseIDInput
WHERE personnelID = :PersonnelIDInput;

-- Delete personnel using personnelID for precision
DELETE FROM PERSONNEL
WHERE personnelID = :PersonnelIDInput;

--*********************************************
-- Munitions Orders:

-- Browse munitions orders with JOINs to display munition type and base name
SELECT MUNITIONS_ORDERS.orderID, MUNITIONS_ORDERS.dateOrdered, MUNITIONS_ORDERS.quantity,
       MUNITIONS.type AS munitionType, BASES.name AS baseName
FROM MUNITIONS_ORDERS
JOIN MUNITIONS ON MUNITIONS_ORDERS.munitionID = MUNITIONS.munitionID
JOIN BASES ON MUNITIONS_ORDERS.baseID = BASES.baseID;

-- Insert munitions orders
INSERT INTO MUNITIONS_ORDERS (dateOrdered, quantity, munitionID, baseID)
VALUES (:DateOrderedInput, :QuantityInput, :MunitionIDInput, :BaseIDInput);

-- Update munitions order using orderID for precision
UPDATE MUNITIONS_ORDERS
SET dateOrdered = :NewDateOrderedInput, quantity = :NewQuantityInput, munitionID = :NewMunitionIDInput, baseID = :NewBaseIDInput
WHERE orderID = :OrderIDInput;

-- Delete munitions order using orderID and munitionID for precision
DELETE FROM MUNITIONS_ORDERS
WHERE orderID = :OrderIDInput AND munitionID = :MunitionIDInput;

--*********************************************
-- Munition Transactions:

-- Browse munition transactions with JOINs for munition type and base name
SELECT MUNITION_TRANSACTIONS.transactionID, MUNITION_TRANSACTIONS.date, MUNITION_TRANSACTIONS.type, MUNITION_TRANSACTIONS.quantity,
       MUNITIONS.type AS munitionType, BASES.name AS baseName
FROM MUNITION_TRANSACTIONS
JOIN MUNITIONS ON MUNITION_TRANSACTIONS.munitionID = MUNITIONS.munitionID
JOIN BASES ON MUNITION_TRANSACTIONS.baseID = BASES.baseID;

-- Insert munition transaction
INSERT INTO MUNITION_TRANSACTIONS (date, type, quantity, munitionID, baseID)
VALUES (:DateInput, :TransactionTypeInput, :QuantityInput, :MunitionIDInput, :BaseIDInput);

-- Update munition transaction using transactionID for precision
UPDATE MUNITION_TRANSACTIONS
SET date = :NewDateInput, type = :NewTransactionTypeInput, quantity = :NewQuantityInput, munitionID = :NewMunitionIDInput, baseID = :NewBaseIDInput
WHERE transactionID = :TransactionIDInput;

-- Delete munition transaction using transactionID for precision
DELETE FROM MUNITION_TRANSACTIONS
WHERE transactionID = :TransactionIDInput AND munitionID = :MunitionIDInput;

--*********************************************
-- Base Munitions:

-- Browse base munitions
SELECT baseID, munitionID, quantity
FROM BASE_MUNITIONS;

-- Insert base munitions
INSERT INTO BASE_MUNITIONS (baseID, munitionID, quantity)
VALUES (:BaseIDInput, :MunitionIDInput, :QuantityInput);

-- Update base munitions using baseID and munitionID for precision
UPDATE BASE_MUNITIONS
SET quantity = :NewQuantityInput
WHERE baseID = :BaseIDInput AND munitionID = :MunitionIDInput;

-- Delete base munitions using baseID and munitionID for precision
DELETE FROM BASE_MUNITIONS
WHERE baseID = :BaseIDInput AND munitionID = :MunitionIDInput;

--*********************************************
-- Personnel Munitions:

-- Browse personnel munitions (sorted by personnel ID)
SELECT personnelID, munitionID, responsibilityType
FROM PERSONNEL_MUNITIONS
ORDER BY personnelID ASC;

-- Alternative: sort by munition ID
SELECT personnelID, munitionID, responsibilityType
FROM PERSONNEL_MUNITIONS
ORDER BY munitionID ASC;

-- Assign munition to personnel
INSERT INTO PERSONNEL_MUNITIONS (personnelID, munitionID, responsibilityType)
VALUES (:PersonnelIDInput, :MunitionIDInput, :ResponsibilityInput);

-- Update munition assignment using personnelID and munitionID for precision
UPDATE PERSONNEL_MUNITIONS
SET responsibilityType = :NewResponsibilityInput
WHERE personnelID = :PersonnelIDInput AND munitionID = :MunitionIDInput;

-- Remove munition assignment using personnelID and munitionID for precision
DELETE FROM PERSONNEL_MUNITIONS
WHERE personnelID = :PersonnelIDInput AND munitionID = :MunitionIDInput;
