-- MySQL dump 10.13  Distrib 9.6.0, for Win64 (x86_64)
--
-- Host: localhost    Database: restaurant_db
-- ------------------------------------------------------
-- Server version	9.6.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ 'b2369511-140f-11f1-8944-106838cbecc1:1-2772';

--
-- Table structure for table `announcements`
--

DROP TABLE IF EXISTS `announcements`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `announcements` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(200) NOT NULL,
  `message` text NOT NULL,
  `target_role` enum('all','manager','employee','chef','delivery') DEFAULT 'all',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `announcements`
--

LOCK TABLES `announcements` WRITE;
/*!40000 ALTER TABLE `announcements` DISABLE KEYS */;
/*!40000 ALTER TABLE `announcements` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `attendance`
--

DROP TABLE IF EXISTS `attendance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `attendance` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `clock_in` datetime DEFAULT NULL,
  `clock_out` datetime DEFAULT NULL,
  `date` date NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `attendance_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attendance`
--

LOCK TABLES `attendance` WRITE;
/*!40000 ALTER TABLE `attendance` DISABLE KEYS */;
/*!40000 ALTER TABLE `attendance` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `attendances`
--

DROP TABLE IF EXISTS `attendances`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `attendances` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `restaurantId` int NOT NULL,
  `clockIn` datetime NOT NULL,
  `clockOut` datetime DEFAULT NULL,
  `status` enum('active','completed') DEFAULT 'active',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  KEY `restaurantId` (`restaurantId`),
  CONSTRAINT `attendances_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `attendances_ibfk_10` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `attendances_ibfk_11` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `attendances_ibfk_12` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `attendances_ibfk_13` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `attendances_ibfk_14` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `attendances_ibfk_15` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `attendances_ibfk_16` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `attendances_ibfk_17` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `attendances_ibfk_18` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `attendances_ibfk_19` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `attendances_ibfk_2` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `attendances_ibfk_20` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `attendances_ibfk_21` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `attendances_ibfk_22` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `attendances_ibfk_23` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `attendances_ibfk_24` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `attendances_ibfk_25` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `attendances_ibfk_26` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `attendances_ibfk_27` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `attendances_ibfk_28` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `attendances_ibfk_29` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `attendances_ibfk_3` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `attendances_ibfk_30` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `attendances_ibfk_31` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `attendances_ibfk_32` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `attendances_ibfk_33` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `attendances_ibfk_34` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `attendances_ibfk_35` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `attendances_ibfk_36` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `attendances_ibfk_37` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `attendances_ibfk_38` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `attendances_ibfk_39` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `attendances_ibfk_4` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `attendances_ibfk_40` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `attendances_ibfk_41` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `attendances_ibfk_42` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `attendances_ibfk_43` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `attendances_ibfk_44` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `attendances_ibfk_45` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `attendances_ibfk_46` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `attendances_ibfk_47` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `attendances_ibfk_48` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `attendances_ibfk_49` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `attendances_ibfk_5` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `attendances_ibfk_50` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `attendances_ibfk_51` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `attendances_ibfk_52` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `attendances_ibfk_53` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `attendances_ibfk_54` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `attendances_ibfk_55` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `attendances_ibfk_56` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `attendances_ibfk_6` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `attendances_ibfk_7` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `attendances_ibfk_8` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `attendances_ibfk_9` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attendances`
--

LOCK TABLES `attendances` WRITE;
/*!40000 ALTER TABLE `attendances` DISABLE KEYS */;
INSERT INTO `attendances` VALUES (1,17,10,'2026-03-10 06:49:40','2026-03-10 06:49:44','completed','2026-03-10 06:49:40','2026-03-10 06:49:44'),(2,18,10,'2026-03-11 05:50:37','2026-03-11 05:50:47','completed','2026-03-11 05:50:37','2026-03-11 05:50:47'),(3,16,10,'2026-03-11 06:01:59','2026-03-11 06:02:09','completed','2026-03-11 06:01:59','2026-03-11 06:02:09'),(4,16,10,'2026-03-11 09:48:17','2026-03-11 09:48:24','completed','2026-03-11 09:48:17','2026-03-11 09:48:24'),(5,16,10,'2026-03-14 11:17:19','2026-03-14 11:17:20','completed','2026-03-14 11:17:19','2026-03-14 11:17:20'),(6,16,10,'2026-03-14 11:17:22','2026-03-14 12:06:22','completed','2026-03-14 11:17:22','2026-03-14 12:06:22'),(7,16,10,'2026-03-14 12:06:24','2026-03-14 12:06:26','completed','2026-03-14 12:06:24','2026-03-14 12:06:26'),(8,16,10,'2026-03-14 12:06:27','2026-03-14 12:06:28','completed','2026-03-14 12:06:27','2026-03-14 12:06:28'),(9,16,10,'2026-03-14 12:35:46','2026-03-14 12:35:50','completed','2026-03-14 12:35:46','2026-03-14 12:35:50');
/*!40000 ALTER TABLE `attendances` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `restaurantId` int NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `categories_name_restaurant_id` (`name`,`restaurantId`),
  KEY `restaurantId` (`restaurantId`),
  CONSTRAINT `categories_ibfk_1` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `categories_ibfk_10` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `categories_ibfk_11` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `categories_ibfk_12` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `categories_ibfk_13` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `categories_ibfk_14` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `categories_ibfk_15` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `categories_ibfk_16` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `categories_ibfk_17` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `categories_ibfk_18` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `categories_ibfk_19` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `categories_ibfk_2` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `categories_ibfk_20` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `categories_ibfk_21` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `categories_ibfk_22` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `categories_ibfk_23` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `categories_ibfk_24` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `categories_ibfk_25` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `categories_ibfk_26` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `categories_ibfk_27` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `categories_ibfk_28` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `categories_ibfk_29` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `categories_ibfk_3` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `categories_ibfk_4` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `categories_ibfk_5` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `categories_ibfk_6` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `categories_ibfk_7` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `categories_ibfk_8` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `categories_ibfk_9` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'biryani',10,'a muttoon biryani ','2026-03-10 07:00:58','2026-03-10 07:00:58'),(2,'Veg Dishes',1,'Delicious vegetarian options','2026-03-10 11:01:33','2026-03-10 11:01:33'),(3,'Non-Veg Dishes',1,'Premium meat and poultry dishes','2026-03-10 11:01:33','2026-03-10 11:01:33'),(4,'Drinks & Beverages',1,'Refreshing drinks','2026-03-10 11:01:33','2026-03-10 11:01:33');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `expenses`
--

DROP TABLE IF EXISTS `expenses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `expenses` (
  `id` int NOT NULL AUTO_INCREMENT,
  `category` varchar(255) NOT NULL,
  `amount` decimal(10,2) NOT NULL DEFAULT '0.00',
  `date` date NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `restaurantId` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `restaurantId` (`restaurantId`),
  CONSTRAINT `expenses_ibfk_1` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `expenses_ibfk_10` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `expenses_ibfk_11` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `expenses_ibfk_12` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `expenses_ibfk_13` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `expenses_ibfk_14` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `expenses_ibfk_15` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `expenses_ibfk_16` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `expenses_ibfk_17` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `expenses_ibfk_18` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `expenses_ibfk_19` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `expenses_ibfk_2` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `expenses_ibfk_20` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `expenses_ibfk_21` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `expenses_ibfk_22` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `expenses_ibfk_23` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `expenses_ibfk_24` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `expenses_ibfk_25` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `expenses_ibfk_26` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `expenses_ibfk_27` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `expenses_ibfk_28` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `expenses_ibfk_3` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `expenses_ibfk_4` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `expenses_ibfk_5` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `expenses_ibfk_6` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `expenses_ibfk_7` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `expenses_ibfk_8` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `expenses_ibfk_9` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `expenses`
--

LOCK TABLES `expenses` WRITE;
/*!40000 ALTER TABLE `expenses` DISABLE KEYS */;
INSERT INTO `expenses` VALUES (2,'Ingredients',100.00,'2026-03-14','',10,'2026-03-14 10:28:47','2026-03-14 10:28:47');
/*!40000 ALTER TABLE `expenses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `feedback`
--

DROP TABLE IF EXISTS `feedback`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `feedback` (
  `id` int NOT NULL AUTO_INCREMENT,
  `customer_name` varchar(100) DEFAULT NULL,
  `message` text,
  `rating` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `feedback_chk_1` CHECK ((`rating` between 1 and 5))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `feedback`
--

LOCK TABLES `feedback` WRITE;
/*!40000 ALTER TABLE `feedback` DISABLE KEYS */;
/*!40000 ALTER TABLE `feedback` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ingredients`
--

DROP TABLE IF EXISTS `ingredients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ingredients` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `unit` varchar(255) NOT NULL DEFAULT 'units',
  `currentStock` decimal(10,2) NOT NULL DEFAULT '0.00',
  `minStockLevel` decimal(10,2) NOT NULL DEFAULT '10.00',
  `restaurantId` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `costPerUnit` decimal(10,2) NOT NULL DEFAULT '0.00',
  `supplierId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `restaurantId` (`restaurantId`),
  KEY `supplierId` (`supplierId`),
  CONSTRAINT `ingredients_ibfk_1` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `ingredients_ibfk_10` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `ingredients_ibfk_11` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `ingredients_ibfk_12` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `ingredients_ibfk_13` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `ingredients_ibfk_14` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `ingredients_ibfk_15` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `ingredients_ibfk_16` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `ingredients_ibfk_17` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `ingredients_ibfk_18` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `ingredients_ibfk_19` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `ingredients_ibfk_2` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `ingredients_ibfk_20` FOREIGN KEY (`supplierId`) REFERENCES `suppliers` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `ingredients_ibfk_21` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `ingredients_ibfk_22` FOREIGN KEY (`supplierId`) REFERENCES `suppliers` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `ingredients_ibfk_23` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `ingredients_ibfk_24` FOREIGN KEY (`supplierId`) REFERENCES `suppliers` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `ingredients_ibfk_25` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `ingredients_ibfk_26` FOREIGN KEY (`supplierId`) REFERENCES `suppliers` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `ingredients_ibfk_27` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `ingredients_ibfk_28` FOREIGN KEY (`supplierId`) REFERENCES `suppliers` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `ingredients_ibfk_29` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `ingredients_ibfk_3` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `ingredients_ibfk_30` FOREIGN KEY (`supplierId`) REFERENCES `suppliers` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `ingredients_ibfk_31` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `ingredients_ibfk_32` FOREIGN KEY (`supplierId`) REFERENCES `suppliers` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `ingredients_ibfk_33` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `ingredients_ibfk_34` FOREIGN KEY (`supplierId`) REFERENCES `suppliers` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `ingredients_ibfk_35` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `ingredients_ibfk_36` FOREIGN KEY (`supplierId`) REFERENCES `suppliers` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `ingredients_ibfk_37` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `ingredients_ibfk_38` FOREIGN KEY (`supplierId`) REFERENCES `suppliers` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `ingredients_ibfk_4` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `ingredients_ibfk_5` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `ingredients_ibfk_6` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `ingredients_ibfk_7` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `ingredients_ibfk_8` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `ingredients_ibfk_9` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Ingredients_supplierId_foreign_idx` FOREIGN KEY (`supplierId`) REFERENCES `suppliers` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ingredients`
--

LOCK TABLES `ingredients` WRITE;
/*!40000 ALTER TABLE `ingredients` DISABLE KEYS */;
INSERT INTO `ingredients` VALUES (1,'tomoto','kg',30.00,12.00,10,'2026-03-11 06:05:21','2026-03-11 06:05:21',0.00,NULL),(2,'tomatoes','kg',10.00,5.00,10,'2026-03-11 06:05:42','2026-03-11 06:05:42',0.00,NULL),(3,'onion','kg',15.00,10.00,10,'2026-03-11 06:07:34','2026-03-11 09:46:36',0.00,NULL);
/*!40000 ALTER TABLE `ingredients` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inventory`
--

DROP TABLE IF EXISTS `inventory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inventory` (
  `id` int NOT NULL AUTO_INCREMENT,
  `item_name` varchar(100) NOT NULL,
  `quantity` decimal(10,2) NOT NULL,
  `unit` varchar(20) DEFAULT NULL,
  `minimum_level` decimal(10,2) DEFAULT NULL,
  `last_updated` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inventory`
--

LOCK TABLES `inventory` WRITE;
/*!40000 ALTER TABLE `inventory` DISABLE KEYS */;
/*!40000 ALTER TABLE `inventory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `menu_items`
--

DROP TABLE IF EXISTS `menu_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `menu_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `category` varchar(50) DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `description` text,
  `image_url` varchar(255) DEFAULT NULL,
  `is_available` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `menu_items`
--

LOCK TABLES `menu_items` WRITE;
/*!40000 ALTER TABLE `menu_items` DISABLE KEYS */;
INSERT INTO `menu_items` VALUES (1,'Margherita Pizza','Pizza',12.99,'Classic tomato and cheese',NULL,1,'2026-03-02 10:59:31'),(2,'Pepperoni Pizza','Pizza',14.99,'Pizza with pepperoni',NULL,1,'2026-03-02 10:59:31'),(3,'Chicken Burger','Burgers',8.99,'Grilled chicken burger',NULL,1,'2026-03-02 10:59:31'),(4,'Beef Burger','Burgers',9.99,'Juicy beef patty',NULL,1,'2026-03-02 10:59:31'),(5,'Coca Cola','Drinks',2.99,'Cold drink 330ml',NULL,1,'2026-03-02 10:59:31'),(6,'French Fries','Sides',3.99,'Crispy golden fries',NULL,1,'2026-03-02 10:59:31');
/*!40000 ALTER TABLE `menu_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `menuitems`
--

DROP TABLE IF EXISTS `menuitems`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `menuitems` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text,
  `price` decimal(10,2) NOT NULL,
  `imageUrl` varchar(255) DEFAULT NULL,
  `isAvailable` tinyint(1) DEFAULT '1',
  `restaurantId` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `categoryId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `restaurantId` (`restaurantId`),
  KEY `categoryId` (`categoryId`),
  CONSTRAINT `menuitems_ibfk_1` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `menuitems_ibfk_10` FOREIGN KEY (`categoryId`) REFERENCES `categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `menuitems_ibfk_11` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `menuitems_ibfk_12` FOREIGN KEY (`categoryId`) REFERENCES `categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `menuitems_ibfk_13` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `menuitems_ibfk_14` FOREIGN KEY (`categoryId`) REFERENCES `categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `menuitems_ibfk_15` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `menuitems_ibfk_16` FOREIGN KEY (`categoryId`) REFERENCES `categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `menuitems_ibfk_17` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `menuitems_ibfk_18` FOREIGN KEY (`categoryId`) REFERENCES `categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `menuitems_ibfk_19` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `menuitems_ibfk_2` FOREIGN KEY (`categoryId`) REFERENCES `categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `menuitems_ibfk_20` FOREIGN KEY (`categoryId`) REFERENCES `categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `menuitems_ibfk_21` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `menuitems_ibfk_22` FOREIGN KEY (`categoryId`) REFERENCES `categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `menuitems_ibfk_23` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `menuitems_ibfk_24` FOREIGN KEY (`categoryId`) REFERENCES `categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `menuitems_ibfk_25` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `menuitems_ibfk_26` FOREIGN KEY (`categoryId`) REFERENCES `categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `menuitems_ibfk_27` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `menuitems_ibfk_28` FOREIGN KEY (`categoryId`) REFERENCES `categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `menuitems_ibfk_29` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `menuitems_ibfk_3` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `menuitems_ibfk_30` FOREIGN KEY (`categoryId`) REFERENCES `categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `menuitems_ibfk_31` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `menuitems_ibfk_32` FOREIGN KEY (`categoryId`) REFERENCES `categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `menuitems_ibfk_33` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `menuitems_ibfk_34` FOREIGN KEY (`categoryId`) REFERENCES `categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `menuitems_ibfk_35` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `menuitems_ibfk_36` FOREIGN KEY (`categoryId`) REFERENCES `categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `menuitems_ibfk_37` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `menuitems_ibfk_38` FOREIGN KEY (`categoryId`) REFERENCES `categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `menuitems_ibfk_39` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `menuitems_ibfk_4` FOREIGN KEY (`categoryId`) REFERENCES `categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `menuitems_ibfk_40` FOREIGN KEY (`categoryId`) REFERENCES `categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `menuitems_ibfk_41` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `menuitems_ibfk_42` FOREIGN KEY (`categoryId`) REFERENCES `categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `menuitems_ibfk_43` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `menuitems_ibfk_44` FOREIGN KEY (`categoryId`) REFERENCES `categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `menuitems_ibfk_45` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `menuitems_ibfk_46` FOREIGN KEY (`categoryId`) REFERENCES `categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `menuitems_ibfk_47` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `menuitems_ibfk_48` FOREIGN KEY (`categoryId`) REFERENCES `categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `menuitems_ibfk_49` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `menuitems_ibfk_5` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `menuitems_ibfk_50` FOREIGN KEY (`categoryId`) REFERENCES `categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `menuitems_ibfk_51` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `menuitems_ibfk_52` FOREIGN KEY (`categoryId`) REFERENCES `categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `menuitems_ibfk_53` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `menuitems_ibfk_54` FOREIGN KEY (`categoryId`) REFERENCES `categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `menuitems_ibfk_55` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `menuitems_ibfk_56` FOREIGN KEY (`categoryId`) REFERENCES `categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `menuitems_ibfk_6` FOREIGN KEY (`categoryId`) REFERENCES `categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `menuitems_ibfk_7` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `menuitems_ibfk_8` FOREIGN KEY (`categoryId`) REFERENCES `categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `menuitems_ibfk_9` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `menuitems`
--

LOCK TABLES `menuitems` WRITE;
/*!40000 ALTER TABLE `menuitems` DISABLE KEYS */;
INSERT INTO `menuitems` VALUES (1,'south indian food','',250.00,'',1,10,'2026-03-10 07:01:26','2026-03-10 07:01:26',1),(2,'Paneer Butter Masala','Cottage cheese in creamy tomato gravy',12.99,NULL,1,1,'2026-03-10 11:01:33','2026-03-10 11:01:33',2),(3,'Veg Biryani','Fragrant basmati rice with seasonal vegetables',10.99,NULL,1,1,'2026-03-10 11:01:33','2026-03-10 11:01:33',2),(4,'Crispy Corn','Golden fried corn with spices',6.99,NULL,1,1,'2026-03-10 11:01:33','2026-03-10 11:01:33',2),(5,'Butter Chicken','Classic smoky chicken in rich tomato cream',15.99,NULL,1,1,'2026-03-10 11:01:33','2026-03-10 11:01:33',3),(6,'Mutton Rogan Josh','Tender mutton cooked in kashmiri spices',18.99,NULL,1,1,'2026-03-10 11:01:33','2026-03-10 11:01:33',3),(7,'Chicken Tikka','Grilled marinated chicken chunks',11.99,NULL,1,1,'2026-03-10 11:01:33','2026-03-10 11:01:33',3),(8,'Mango Lassi','Traditional yogurt-based mango drink',4.99,NULL,1,1,'2026-03-10 11:01:33','2026-03-10 11:01:33',4),(9,'Fresh Lime Soda','Refreshing lime with soda and mint',3.49,NULL,1,1,'2026-03-10 11:01:33','2026-03-10 11:01:33',4);
/*!40000 ALTER TABLE `menuitems` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `menu_item_id` int NOT NULL,
  `quantity` int NOT NULL,
  `price` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  KEY `menu_item_id` (`menu_item_id`),
  CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`menu_item_id`) REFERENCES `menu_items` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `status` enum('Sent to kitchen','Preparing','Ready','Out for delivery','Served','Delivered') DEFAULT 'Sent to kitchen',
  `code` varchar(255) NOT NULL,
  `table` varchar(255) DEFAULT NULL,
  `type` enum('dine-in','takeaway','delivery') DEFAULT 'dine-in',
  `subtotal` decimal(10,2) NOT NULL,
  `taxes` decimal(10,2) NOT NULL,
  `total` decimal(10,2) NOT NULL,
  `itemsJson` json NOT NULL,
  `restaurantId` int NOT NULL,
  `createdById` int DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`),
  UNIQUE KEY `code_2` (`code`),
  UNIQUE KEY `code_3` (`code`),
  UNIQUE KEY `code_4` (`code`),
  UNIQUE KEY `code_5` (`code`),
  UNIQUE KEY `code_6` (`code`),
  UNIQUE KEY `code_7` (`code`),
  UNIQUE KEY `code_8` (`code`),
  UNIQUE KEY `code_9` (`code`),
  UNIQUE KEY `code_10` (`code`),
  UNIQUE KEY `code_11` (`code`),
  UNIQUE KEY `code_12` (`code`),
  UNIQUE KEY `code_13` (`code`),
  UNIQUE KEY `code_14` (`code`),
  UNIQUE KEY `code_15` (`code`),
  UNIQUE KEY `code_16` (`code`),
  UNIQUE KEY `code_17` (`code`),
  UNIQUE KEY `code_18` (`code`),
  UNIQUE KEY `code_19` (`code`),
  UNIQUE KEY `code_20` (`code`),
  UNIQUE KEY `code_21` (`code`),
  UNIQUE KEY `code_22` (`code`),
  UNIQUE KEY `code_23` (`code`),
  UNIQUE KEY `code_24` (`code`),
  UNIQUE KEY `code_25` (`code`),
  UNIQUE KEY `code_26` (`code`),
  UNIQUE KEY `code_27` (`code`),
  KEY `restaurantId` (`restaurantId`),
  KEY `createdById` (`createdById`),
  CONSTRAINT `Orders_createdById_foreign_idx` FOREIGN KEY (`createdById`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `orders_ibfk_10` FOREIGN KEY (`createdById`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `orders_ibfk_11` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `orders_ibfk_12` FOREIGN KEY (`createdById`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `orders_ibfk_13` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `orders_ibfk_14` FOREIGN KEY (`createdById`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `orders_ibfk_15` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `orders_ibfk_16` FOREIGN KEY (`createdById`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `orders_ibfk_17` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `orders_ibfk_18` FOREIGN KEY (`createdById`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `orders_ibfk_19` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`createdById`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `orders_ibfk_20` FOREIGN KEY (`createdById`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `orders_ibfk_21` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `orders_ibfk_22` FOREIGN KEY (`createdById`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `orders_ibfk_23` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `orders_ibfk_24` FOREIGN KEY (`createdById`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `orders_ibfk_25` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `orders_ibfk_26` FOREIGN KEY (`createdById`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `orders_ibfk_27` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `orders_ibfk_28` FOREIGN KEY (`createdById`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `orders_ibfk_29` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `orders_ibfk_3` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `orders_ibfk_30` FOREIGN KEY (`createdById`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `orders_ibfk_31` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `orders_ibfk_32` FOREIGN KEY (`createdById`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `orders_ibfk_33` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `orders_ibfk_34` FOREIGN KEY (`createdById`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `orders_ibfk_35` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `orders_ibfk_36` FOREIGN KEY (`createdById`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `orders_ibfk_37` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `orders_ibfk_38` FOREIGN KEY (`createdById`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `orders_ibfk_39` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `orders_ibfk_4` FOREIGN KEY (`createdById`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `orders_ibfk_40` FOREIGN KEY (`createdById`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `orders_ibfk_41` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `orders_ibfk_42` FOREIGN KEY (`createdById`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `orders_ibfk_43` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `orders_ibfk_44` FOREIGN KEY (`createdById`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `orders_ibfk_45` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `orders_ibfk_46` FOREIGN KEY (`createdById`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `orders_ibfk_47` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `orders_ibfk_48` FOREIGN KEY (`createdById`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `orders_ibfk_49` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `orders_ibfk_5` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `orders_ibfk_50` FOREIGN KEY (`createdById`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `orders_ibfk_51` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `orders_ibfk_52` FOREIGN KEY (`createdById`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `orders_ibfk_6` FOREIGN KEY (`createdById`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `orders_ibfk_7` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `orders_ibfk_8` FOREIGN KEY (`createdById`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `orders_ibfk_9` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Orders_restaurantId_foreign_idx` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,'Served','DE-RYMRXND','5','dine-in',1250.00,125.00,1375.00,'[{\"id\": 1, \"name\": \"south indian food\", \"price\": \"250.00\", \"quantity\": 5}]',10,NULL,'2026-03-11 06:01:07','2026-03-11 06:03:08',NULL,NULL),(2,'Delivered','DE-2LW4VE7','Takeaway','takeaway',750.00,75.00,825.00,'[{\"id\": 1, \"name\": \"south indian food\", \"price\": 250, \"quantity\": 3}]',10,18,'2026-03-11 06:09:24','2026-03-11 06:10:15',NULL,NULL),(3,'Served','DE-ZX30OKM','1','dine-in',250.00,25.00,275.00,'[{\"id\": 1, \"name\": \"south indian food\", \"price\": \"250.00\", \"quantity\": 1}]',10,NULL,'2026-03-11 09:51:15','2026-03-11 09:53:03',NULL,NULL),(4,'Served','DE-9OADX6G','Takeaway','takeaway',500.00,50.00,550.00,'[{\"id\": 1, \"name\": \"south indian food\", \"price\": \"250.00\", \"quantity\": 2}]',10,NULL,'2026-03-11 09:58:50','2026-03-11 10:08:10',NULL,NULL),(5,'Served','DE-JCBPUM7','Takeaway','takeaway',250.00,25.00,275.00,'[{\"id\": 1, \"name\": \"south indian food\", \"price\": \"250.00\", \"quantity\": 1}]',10,NULL,'2026-03-11 10:06:21','2026-03-11 10:08:08',NULL,NULL),(6,'Delivered','DE-RQ43ZUY','','delivery',250.00,25.00,275.00,'[{\"id\": 1, \"name\": \"south indian food\", \"price\": \"250.00\", \"quantity\": 1}]',10,NULL,'2026-03-11 10:40:52','2026-03-11 10:42:19','kammanhalli','9380991858'),(7,'Served','DE-Y7XCBCV','6','dine-in',250.00,25.00,275.00,'[{\"id\": 1, \"name\": \"south indian food\", \"price\": \"250.00\", \"quantity\": 1}]',10,NULL,'2026-03-12 06:21:39','2026-03-12 06:22:40',NULL,NULL),(8,'Served','DE-6AC9Q34','Takeaway','takeaway',250.00,25.00,275.00,'[{\"id\": 1, \"name\": \"south indian food\", \"price\": \"250.00\", \"quantity\": 1}]',10,NULL,'2026-03-14 12:35:11','2026-03-14 12:36:22',NULL,'9164743424');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `purchaseorderitems`
--

DROP TABLE IF EXISTS `purchaseorderitems`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `purchaseorderitems` (
  `id` int NOT NULL AUTO_INCREMENT,
  `purchaseOrderId` int NOT NULL,
  `ingredientId` int NOT NULL,
  `quantity` decimal(10,2) NOT NULL,
  `unitPrice` decimal(10,2) NOT NULL,
  `totalPrice` decimal(10,2) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `purchaseOrderId` (`purchaseOrderId`),
  KEY `ingredientId` (`ingredientId`),
  CONSTRAINT `purchaseorderitems_ibfk_1` FOREIGN KEY (`purchaseOrderId`) REFERENCES `purchaseorders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `purchaseorderitems_ibfk_10` FOREIGN KEY (`ingredientId`) REFERENCES `ingredients` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `purchaseorderitems_ibfk_11` FOREIGN KEY (`purchaseOrderId`) REFERENCES `purchaseorders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `purchaseorderitems_ibfk_12` FOREIGN KEY (`ingredientId`) REFERENCES `ingredients` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `purchaseorderitems_ibfk_13` FOREIGN KEY (`purchaseOrderId`) REFERENCES `purchaseorders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `purchaseorderitems_ibfk_14` FOREIGN KEY (`ingredientId`) REFERENCES `ingredients` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `purchaseorderitems_ibfk_15` FOREIGN KEY (`purchaseOrderId`) REFERENCES `purchaseorders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `purchaseorderitems_ibfk_16` FOREIGN KEY (`ingredientId`) REFERENCES `ingredients` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `purchaseorderitems_ibfk_17` FOREIGN KEY (`purchaseOrderId`) REFERENCES `purchaseorders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `purchaseorderitems_ibfk_18` FOREIGN KEY (`ingredientId`) REFERENCES `ingredients` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `purchaseorderitems_ibfk_19` FOREIGN KEY (`purchaseOrderId`) REFERENCES `purchaseorders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `purchaseorderitems_ibfk_2` FOREIGN KEY (`ingredientId`) REFERENCES `ingredients` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `purchaseorderitems_ibfk_20` FOREIGN KEY (`ingredientId`) REFERENCES `ingredients` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `purchaseorderitems_ibfk_3` FOREIGN KEY (`purchaseOrderId`) REFERENCES `purchaseorders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `purchaseorderitems_ibfk_4` FOREIGN KEY (`ingredientId`) REFERENCES `ingredients` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `purchaseorderitems_ibfk_5` FOREIGN KEY (`purchaseOrderId`) REFERENCES `purchaseorders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `purchaseorderitems_ibfk_6` FOREIGN KEY (`ingredientId`) REFERENCES `ingredients` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `purchaseorderitems_ibfk_7` FOREIGN KEY (`purchaseOrderId`) REFERENCES `purchaseorders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `purchaseorderitems_ibfk_8` FOREIGN KEY (`ingredientId`) REFERENCES `ingredients` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `purchaseorderitems_ibfk_9` FOREIGN KEY (`purchaseOrderId`) REFERENCES `purchaseorders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `purchaseorderitems`
--

LOCK TABLES `purchaseorderitems` WRITE;
/*!40000 ALTER TABLE `purchaseorderitems` DISABLE KEYS */;
INSERT INTO `purchaseorderitems` VALUES (1,1,3,20.00,20.00,400.00,'2026-03-14 12:04:21','2026-03-14 12:04:21');
/*!40000 ALTER TABLE `purchaseorderitems` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `purchaseorders`
--

DROP TABLE IF EXISTS `purchaseorders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `purchaseorders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `code` varchar(255) NOT NULL,
  `supplierId` int NOT NULL,
  `restaurantId` int NOT NULL,
  `status` enum('Pending','Received','Cancelled') DEFAULT 'Pending',
  `totalAmount` decimal(10,2) NOT NULL DEFAULT '0.00',
  `notes` text,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`),
  UNIQUE KEY `code_2` (`code`),
  UNIQUE KEY `code_3` (`code`),
  UNIQUE KEY `code_4` (`code`),
  UNIQUE KEY `code_5` (`code`),
  UNIQUE KEY `code_6` (`code`),
  UNIQUE KEY `code_7` (`code`),
  UNIQUE KEY `code_8` (`code`),
  UNIQUE KEY `code_9` (`code`),
  UNIQUE KEY `code_10` (`code`),
  KEY `supplierId` (`supplierId`),
  KEY `restaurantId` (`restaurantId`),
  CONSTRAINT `purchaseorders_ibfk_1` FOREIGN KEY (`supplierId`) REFERENCES `suppliers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `purchaseorders_ibfk_10` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `purchaseorders_ibfk_11` FOREIGN KEY (`supplierId`) REFERENCES `suppliers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `purchaseorders_ibfk_12` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `purchaseorders_ibfk_13` FOREIGN KEY (`supplierId`) REFERENCES `suppliers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `purchaseorders_ibfk_14` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `purchaseorders_ibfk_15` FOREIGN KEY (`supplierId`) REFERENCES `suppliers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `purchaseorders_ibfk_16` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `purchaseorders_ibfk_17` FOREIGN KEY (`supplierId`) REFERENCES `suppliers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `purchaseorders_ibfk_18` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `purchaseorders_ibfk_19` FOREIGN KEY (`supplierId`) REFERENCES `suppliers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `purchaseorders_ibfk_2` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `purchaseorders_ibfk_20` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `purchaseorders_ibfk_3` FOREIGN KEY (`supplierId`) REFERENCES `suppliers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `purchaseorders_ibfk_4` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `purchaseorders_ibfk_5` FOREIGN KEY (`supplierId`) REFERENCES `suppliers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `purchaseorders_ibfk_6` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `purchaseorders_ibfk_7` FOREIGN KEY (`supplierId`) REFERENCES `suppliers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `purchaseorders_ibfk_8` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `purchaseorders_ibfk_9` FOREIGN KEY (`supplierId`) REFERENCES `suppliers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `purchaseorders`
--

LOCK TABLES `purchaseorders` WRITE;
/*!40000 ALTER TABLE `purchaseorders` DISABLE KEYS */;
INSERT INTO `purchaseorders` VALUES (1,'PO-1773489861325',1,10,'Pending',400.00,'','2026-03-14 12:04:21','2026-03-14 12:04:21');
/*!40000 ALTER TABLE `purchaseorders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `recipeingredients`
--

DROP TABLE IF EXISTS `recipeingredients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `recipeingredients` (
  `id` int NOT NULL AUTO_INCREMENT,
  `menuItemId` int NOT NULL,
  `ingredientId` int NOT NULL,
  `quantity` decimal(10,2) NOT NULL COMMENT 'Quantity of ingredient needed for this menu item',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `RecipeIngredients_ingredientId_menuItemId_unique` (`menuItemId`,`ingredientId`),
  KEY `ingredientId` (`ingredientId`),
  CONSTRAINT `recipeingredients_ibfk_1` FOREIGN KEY (`menuItemId`) REFERENCES `menuitems` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `recipeingredients_ibfk_10` FOREIGN KEY (`ingredientId`) REFERENCES `ingredients` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `recipeingredients_ibfk_11` FOREIGN KEY (`menuItemId`) REFERENCES `menuitems` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `recipeingredients_ibfk_12` FOREIGN KEY (`ingredientId`) REFERENCES `ingredients` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `recipeingredients_ibfk_13` FOREIGN KEY (`menuItemId`) REFERENCES `menuitems` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `recipeingredients_ibfk_14` FOREIGN KEY (`ingredientId`) REFERENCES `ingredients` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `recipeingredients_ibfk_15` FOREIGN KEY (`menuItemId`) REFERENCES `menuitems` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `recipeingredients_ibfk_16` FOREIGN KEY (`ingredientId`) REFERENCES `ingredients` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `recipeingredients_ibfk_17` FOREIGN KEY (`menuItemId`) REFERENCES `menuitems` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `recipeingredients_ibfk_18` FOREIGN KEY (`ingredientId`) REFERENCES `ingredients` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `recipeingredients_ibfk_19` FOREIGN KEY (`menuItemId`) REFERENCES `menuitems` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `recipeingredients_ibfk_2` FOREIGN KEY (`ingredientId`) REFERENCES `ingredients` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `recipeingredients_ibfk_20` FOREIGN KEY (`ingredientId`) REFERENCES `ingredients` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `recipeingredients_ibfk_3` FOREIGN KEY (`menuItemId`) REFERENCES `menuitems` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `recipeingredients_ibfk_4` FOREIGN KEY (`ingredientId`) REFERENCES `ingredients` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `recipeingredients_ibfk_5` FOREIGN KEY (`menuItemId`) REFERENCES `menuitems` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `recipeingredients_ibfk_6` FOREIGN KEY (`ingredientId`) REFERENCES `ingredients` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `recipeingredients_ibfk_7` FOREIGN KEY (`menuItemId`) REFERENCES `menuitems` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `recipeingredients_ibfk_8` FOREIGN KEY (`ingredientId`) REFERENCES `ingredients` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `recipeingredients_ibfk_9` FOREIGN KEY (`menuItemId`) REFERENCES `menuitems` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recipeingredients`
--

LOCK TABLES `recipeingredients` WRITE;
/*!40000 ALTER TABLE `recipeingredients` DISABLE KEYS */;
/*!40000 ALTER TABLE `recipeingredients` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reservations`
--

DROP TABLE IF EXISTS `reservations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reservations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `customer_name` varchar(100) NOT NULL,
  `customer_phone` varchar(20) DEFAULT NULL,
  `date` date NOT NULL,
  `time` time NOT NULL,
  `number_of_guests` int DEFAULT NULL,
  `table_number` int DEFAULT NULL,
  `status` enum('pending','confirmed','cancelled') DEFAULT 'pending',
  `notes` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reservations`
--

LOCK TABLES `reservations` WRITE;
/*!40000 ALTER TABLE `reservations` DISABLE KEYS */;
/*!40000 ALTER TABLE `reservations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `restaurants`
--

DROP TABLE IF EXISTS `restaurants`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `restaurants` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  `phoneNumber` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `subscriptionStatus` enum('active','inactive','trial') DEFAULT 'trial',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `restaurants`
--

LOCK TABLES `restaurants` WRITE;
/*!40000 ALTER TABLE `restaurants` DISABLE KEYS */;
INSERT INTO `restaurants` VALUES (1,'Test Resto',NULL,NULL,NULL,'trial','2026-03-07 15:47:08','2026-03-07 15:47:08'),(2,'Test User Resto',NULL,NULL,NULL,'trial','2026-03-07 15:47:23','2026-03-07 15:47:23'),(3,'Final Fix Resto',NULL,NULL,NULL,'trial','2026-03-07 15:48:09','2026-03-07 15:48:09'),(4,'Pizza Palace',NULL,NULL,NULL,'trial','2026-03-07 15:49:12','2026-03-07 15:49:12'),(5,'disrestu',NULL,NULL,NULL,'trial','2026-03-07 15:55:07','2026-03-07 15:55:07'),(6,'Debug Resto',NULL,NULL,NULL,'trial','2026-03-07 16:01:12','2026-03-07 16:01:12'),(7,'disrestu',NULL,NULL,NULL,'trial','2026-03-07 16:14:34','2026-03-07 16:14:34'),(8,'disrestu',NULL,NULL,NULL,'trial','2026-03-07 16:15:10','2026-03-07 16:15:10'),(9,'bisi bisi',NULL,NULL,NULL,'trial','2026-03-09 05:40:26','2026-03-09 05:40:26'),(10,'Dine-Ease Downtown',NULL,NULL,NULL,'trial','2026-03-09 11:51:10','2026-03-09 11:51:10'),(11,'sam resturuant ',NULL,NULL,NULL,'trial','2026-03-10 10:35:01','2026-03-10 10:35:01'),(12,'johnrest',NULL,NULL,NULL,'trial','2026-03-13 04:31:45','2026-03-13 04:31:45');
/*!40000 ALTER TABLE `restaurants` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `salaries`
--

DROP TABLE IF EXISTS `salaries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `salaries` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `month` varchar(20) NOT NULL,
  `base_salary` decimal(10,2) DEFAULT NULL,
  `bonus` decimal(10,2) DEFAULT '0.00',
  `deductions` decimal(10,2) DEFAULT '0.00',
  `net_salary` decimal(10,2) DEFAULT NULL,
  `paid_on` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `salaries_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `salaries`
--

LOCK TABLES `salaries` WRITE;
/*!40000 ALTER TABLE `salaries` DISABLE KEYS */;
/*!40000 ALTER TABLE `salaries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `schedules`
--

DROP TABLE IF EXISTS `schedules`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `schedules` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `shift_date` date NOT NULL,
  `shift_start` time NOT NULL,
  `shift_end` time NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `schedules_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `schedules`
--

LOCK TABLES `schedules` WRITE;
/*!40000 ALTER TABLE `schedules` DISABLE KEYS */;
/*!40000 ALTER TABLE `schedules` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shifts`
--

DROP TABLE IF EXISTS `shifts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shifts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `restaurantId` int NOT NULL,
  `startTime` datetime NOT NULL,
  `endTime` datetime NOT NULL,
  `role` enum('manager','employee','chef','delivery','waiter','staff') NOT NULL,
  `status` enum('scheduled','completed','cancelled') DEFAULT 'scheduled',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  KEY `restaurantId` (`restaurantId`),
  CONSTRAINT `shifts_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `shifts_ibfk_10` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `shifts_ibfk_11` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `shifts_ibfk_12` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `shifts_ibfk_13` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `shifts_ibfk_14` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `shifts_ibfk_15` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `shifts_ibfk_16` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `shifts_ibfk_17` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `shifts_ibfk_18` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `shifts_ibfk_19` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `shifts_ibfk_2` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `shifts_ibfk_20` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `shifts_ibfk_3` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `shifts_ibfk_4` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `shifts_ibfk_5` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `shifts_ibfk_6` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `shifts_ibfk_7` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `shifts_ibfk_8` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `shifts_ibfk_9` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shifts`
--

LOCK TABLES `shifts` WRITE;
/*!40000 ALTER TABLE `shifts` DISABLE KEYS */;
INSERT INTO `shifts` VALUES (1,16,10,'2026-03-14 03:30:00','2026-03-14 11:30:00','employee','scheduled','2026-03-14 12:03:10','2026-03-14 12:03:10');
/*!40000 ALTER TABLE `shifts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `suppliers`
--

DROP TABLE IF EXISTS `suppliers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `suppliers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `contactName` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `restaurantId` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `restaurantId` (`restaurantId`),
  CONSTRAINT `suppliers_ibfk_1` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `suppliers_ibfk_10` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `suppliers_ibfk_11` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `suppliers_ibfk_2` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `suppliers_ibfk_3` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `suppliers_ibfk_4` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `suppliers_ibfk_5` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `suppliers_ibfk_6` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `suppliers_ibfk_7` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `suppliers_ibfk_8` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `suppliers_ibfk_9` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `suppliers`
--

LOCK TABLES `suppliers` WRITE;
/*!40000 ALTER TABLE `suppliers` DISABLE KEYS */;
INSERT INTO `suppliers` VALUES (1,'Balapvt','bala','9689246501','bala@gmail.com','kammanahalli',10,'2026-03-14 12:03:38','2026-03-14 12:03:38');
/*!40000 ALTER TABLE `suppliers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tables`
--

DROP TABLE IF EXISTS `tables`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tables` (
  `id` int NOT NULL AUTO_INCREMENT,
  `number` varchar(255) NOT NULL,
  `capacity` int NOT NULL DEFAULT '4',
  `status` enum('available','occupied') DEFAULT 'available',
  `restaurantId` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `restaurantId` (`restaurantId`),
  CONSTRAINT `tables_ibfk_1` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `tables_ibfk_10` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `tables_ibfk_11` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `tables_ibfk_12` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `tables_ibfk_13` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `tables_ibfk_14` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `tables_ibfk_15` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `tables_ibfk_16` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `tables_ibfk_17` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `tables_ibfk_18` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `tables_ibfk_19` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `tables_ibfk_2` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `tables_ibfk_20` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `tables_ibfk_21` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `tables_ibfk_22` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `tables_ibfk_23` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `tables_ibfk_24` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `tables_ibfk_25` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `tables_ibfk_26` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `tables_ibfk_27` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `tables_ibfk_28` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `tables_ibfk_3` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `tables_ibfk_4` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `tables_ibfk_5` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `tables_ibfk_6` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `tables_ibfk_7` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `tables_ibfk_8` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `tables_ibfk_9` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tables`
--

LOCK TABLES `tables` WRITE;
/*!40000 ALTER TABLE `tables` DISABLE KEYS */;
INSERT INTO `tables` VALUES (1,'1',4,'available',10,'2026-03-10 06:45:28','2026-03-10 06:45:28'),(2,'1',6,'available',11,'2026-03-10 10:36:40','2026-03-10 10:36:40'),(3,'2',6,'available',10,'2026-03-10 19:03:52','2026-03-10 19:03:52'),(4,'1',4,'available',8,'2026-03-11 09:49:20','2026-03-11 09:49:20'),(5,'2',4,'available',8,'2026-03-11 09:49:23','2026-03-11 09:49:23'),(7,'3',5,'available',8,'2026-03-11 09:49:46','2026-03-11 09:49:46'),(8,'3',10,'available',10,'2026-03-14 12:29:42','2026-03-14 12:29:42');
/*!40000 ALTER TABLE `tables` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('super-admin','admin','manager','employee','chef','delivery') DEFAULT 'employee',
  `restaurantId` int DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `hourlyRate` decimal(10,2) DEFAULT '0.00',
  `permissions` json DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `email_2` (`email`),
  UNIQUE KEY `email_3` (`email`),
  UNIQUE KEY `email_4` (`email`),
  UNIQUE KEY `email_5` (`email`),
  UNIQUE KEY `email_6` (`email`),
  UNIQUE KEY `email_7` (`email`),
  UNIQUE KEY `email_8` (`email`),
  UNIQUE KEY `email_9` (`email`),
  UNIQUE KEY `email_10` (`email`),
  UNIQUE KEY `email_11` (`email`),
  UNIQUE KEY `email_12` (`email`),
  UNIQUE KEY `email_13` (`email`),
  UNIQUE KEY `email_14` (`email`),
  UNIQUE KEY `email_15` (`email`),
  UNIQUE KEY `email_16` (`email`),
  UNIQUE KEY `email_17` (`email`),
  UNIQUE KEY `email_18` (`email`),
  UNIQUE KEY `email_19` (`email`),
  UNIQUE KEY `email_20` (`email`),
  UNIQUE KEY `email_21` (`email`),
  UNIQUE KEY `email_22` (`email`),
  UNIQUE KEY `email_23` (`email`),
  UNIQUE KEY `email_24` (`email`),
  UNIQUE KEY `email_25` (`email`),
  UNIQUE KEY `email_26` (`email`),
  UNIQUE KEY `email_27` (`email`),
  UNIQUE KEY `email_28` (`email`),
  UNIQUE KEY `email_29` (`email`),
  UNIQUE KEY `email_30` (`email`),
  UNIQUE KEY `email_31` (`email`),
  KEY `restaurantId` (`restaurantId`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `users_ibfk_10` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `users_ibfk_11` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `users_ibfk_12` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `users_ibfk_13` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `users_ibfk_14` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `users_ibfk_15` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `users_ibfk_16` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `users_ibfk_17` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `users_ibfk_18` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `users_ibfk_19` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `users_ibfk_2` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `users_ibfk_20` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `users_ibfk_21` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `users_ibfk_22` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `users_ibfk_23` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `users_ibfk_24` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `users_ibfk_25` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `users_ibfk_26` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `users_ibfk_27` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `users_ibfk_28` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `users_ibfk_29` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `users_ibfk_3` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `users_ibfk_30` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `users_ibfk_31` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `users_ibfk_4` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `users_ibfk_5` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `users_ibfk_6` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `users_ibfk_7` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `users_ibfk_8` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `users_ibfk_9` FOREIGN KEY (`restaurantId`) REFERENCES `restaurants` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Test U','test_u@example.com','pass','admin',2,'2026-03-07 15:47:23','2026-03-07 15:47:23',0.00,NULL),(2,'Final Test','final@test.com','$2b$10$KqlH.Nza6m5jisrQRfzQQOIND779ggrL09CeBo6o0R/8Y/H878Cg.','admin',3,'2026-03-07 15:48:10','2026-03-07 15:48:10',0.00,NULL),(3,'Ramesh','Ramesh122@gmail.com','$2b$10$nK.jGW01le2k/a7OyIXhTufcFTHTKcBfKUG2nzSZYMz.9oG9Mkmu2','admin',4,'2026-03-07 15:49:12','2026-03-07 15:49:12',0.00,NULL),(4,'syed','myadmin@restaurant.com','$2b$10$UyMRSqGN75ssb90uDQXU8.mIPbzxLn07wEhr7L2.CfKgPLtb1Zm.G','admin',5,'2026-03-07 15:55:07','2026-03-07 15:55:07',0.00,NULL),(5,'Debug Test','debug@test.com','$2b$10$DqNb79cr9icKdkZ9ZH2MSe1IFgZY6ac2s/YKo618iHPQU.znWb5Gu','admin',6,'2026-03-07 16:01:12','2026-03-07 16:01:12',0.00,NULL),(6,'syedzahid','myadmi1n@restaurant.com','$2b$10$sDc/LHbb2br3ND0xh5yMp.D3xpixpVIgM8AWmcj8GHJOToUeh2X1C','admin',7,'2026-03-07 16:14:34','2026-03-07 16:14:34',0.00,NULL),(7,'syedzahid','myadmin1@restaurant.com','$2b$10$ALjBhrMuc6iy1cJ0Zd1rHeGDv0dNwHEeKri6yO82zRcHtGNE28ZDK','admin',8,'2026-03-07 16:15:10','2026-03-07 16:15:10',0.00,NULL),(8,'syedzahisdhofhalsdhf','sdjbgfkjashdkjfh@gmai.com','$2b$10$hImaAJLf1GfAcMxOPFeERObWdcMh4m8rH/AJ/h2P8QBB4fcsqTtUC','employee',3,'2026-03-07 16:19:29','2026-03-07 16:19:29',0.00,NULL),(9,'john1','sdjbgfkjashdkjfhs@gmai.com','$2b$10$fyiSa.r5ynPlUKDL.mxdheX9mwm53sO2nSPS7/Kc2oGle.lKCSwKK','chef',5,'2026-03-07 16:23:50','2026-03-07 16:23:50',0.00,NULL),(10,'divya maam','divyamaam@gmail.com','$2b$10$nkYkNkb.7O2Jqsjb/JWuoOSnDNsBsX9L57nWAOJDaEdlkjRlWDemy','admin',9,'2026-03-09 05:40:26','2026-03-09 05:40:26',0.00,NULL),(11,'nice','Ramesh22@gmail.com','$2b$10$nfiD5AiCFIbXjjr1zC57/.LSBp7p4/6PE2xTE4gx20aUGOUPWxDPu','chef',4,'2026-03-09 11:34:19','2026-03-09 11:34:19',0.00,NULL),(12,'nices','2sjdfj2@gmail.com','$2b$10$KbGhb1DVGBOuA0bYSZ5WmO6N/h9uKtkMv/BfKfTwa.YdmEdkBWlX.','delivery',4,'2026-03-09 11:35:07','2026-03-09 11:35:07',0.00,NULL),(13,'nice jslkdjfl','2sjdfsj2@gmail.com','$2b$10$6sC7PiMWMIt/HQdRrpeLvuyOAoDkTBJzwQhhGMHkKTaVJtq19xjzK','manager',4,'2026-03-09 11:35:44','2026-03-09 11:35:44',0.00,NULL),(14,' Alice Admin','admin@dineease.local','$2b$10$i/ZJYkCVA/YY.TjiYO109Obv1M9jimrRfUa95qYu2PgVdhEQ/H1pq','admin',10,'2026-03-09 11:51:10','2026-03-09 11:51:10',0.00,NULL),(15,'Maria Manager','manager@dineease.local','$2b$10$GMKyPsSRX8dC7IugRflH4u8yNIERlrfCdcJOn7VU60YQWkf5dTBbW','manager',10,'2026-03-09 11:52:20','2026-03-09 11:52:20',0.00,NULL),(16,'Carlos Chef','chef@dineease.local','$2b$10$1acullhV37XIXBrflghXROBsl6XmUkGDzpDOxl9UsKS4bxCosoFXi','chef',10,'2026-03-09 11:53:00','2026-03-09 11:53:00',0.00,NULL),(17,' David Delivery','delivery@dineease.local','$2b$10$yg3jMG8.6Yib6eIuKu7oBOLxYCVmyL0O5RSWLUubv/ciDg8LxHDuK','delivery',10,'2026-03-09 11:53:45','2026-03-09 11:53:45',0.00,NULL),(18,'john','sdjbgfkjashdkjfhs@gmail.com','$2b$10$zi6VsAjlInCaDVzpj45Kf.GqmLrytPXHm539AtjU9ij/wj4xFzd2m','employee',10,'2026-03-09 18:07:40','2026-03-09 18:07:40',0.00,NULL),(19,'sandhya s','sandhya@gmail.com','$2b$10$OKMaLwZbn3BdUVAmVOiNEO.ufkgmGi8oPw.cmV.mKbuw0dVXcbA86','admin',11,'2026-03-10 10:35:02','2026-03-10 10:35:02',0.00,NULL),(20,'Don','Don@gmail.com','$2b$10$Sq3USB5Bg.PS/GNPeqoTB.hccobRPg16Z2DHGmlvruWCb9QNFSs3S','manager',11,'2026-03-10 10:38:50','2026-03-10 10:38:50',0.00,NULL),(21,'john','johnres@123.com','$2b$10$CKOL5v050qHUoca0d0S.BeWPTrdBiQotZmOgJ7KUEeOpN.rrKeWoS','admin',12,'2026-03-13 04:31:45','2026-03-13 04:31:45',0.00,NULL),(22,'ramesh','johnres1@123.com','$2b$10$UbEQ/dNFEOBQwjMnBYexJuVml.uB155M3KTuj.MP2hWTaZdIlt3wS','employee',12,'2026-03-13 04:32:56','2026-03-13 04:32:56',0.00,NULL),(23,'ganga','johnres21@123.com','$2b$10$N/RpHJxroyJcKdA6/muJU.9wO/Rn0lSaJtPzpQ7OVymHUB54EIJS2','manager',12,'2026-03-13 04:33:45','2026-03-13 04:33:45',0.00,NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-03-15  2:33:26
