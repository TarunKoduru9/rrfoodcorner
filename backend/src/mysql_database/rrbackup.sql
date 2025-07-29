-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: localhost    Database: rr_food_corner
-- ------------------------------------------------------
-- Server version	8.0.42

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

--
-- Table structure for table `addresses`
--

DROP TABLE IF EXISTS `addresses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `addresses` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `house_block_no` varchar(255) DEFAULT NULL,
  `area_road` varchar(255) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `district` varchar(100) DEFAULT NULL,
  `state` varchar(100) DEFAULT NULL,
  `country` varchar(100) DEFAULT NULL,
  `pincode` varchar(20) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `addresses_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `addresses`
--

LOCK TABLES `addresses` WRITE;
/*!40000 ALTER TABLE `addresses` DISABLE KEYS */;
INSERT INTO `addresses` VALUES (1,6,'12','Balaji nagar ','Old guntur ','Guntur ','Andhra Pradesh ','India','522001','2025-07-09 17:04:56'),(2,7,'13','Balaji Nagar ','Old guntur ','Guntur ','Andhra Pradesh ','India','522001','2025-07-10 09:24:56');
/*!40000 ALTER TABLE `addresses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `catimage_url` varchar(225) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'FRIED RICE','/uploads/categories/fc5.jpg'),(2,'NOODLES','/uploads/categories/fc30.jpg'),(3,'VEG STARTERS','/uploads/categories/fc43.jpg'),(4,'NON VEG STARTERS','/uploads/categories/fc46.jpg'),(5,'NORTH INDIANS COMBOS(VEG)','/uploads/categories/fc55.jpg'),(6,'NORTH INDIANS COMBOS(NON VEG)','/uploads/categories/fc61.jpg'),(7,'FOOD CORNER SPECIAL','/uploads/categories/fc77.jpg');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `coupons`
--

DROP TABLE IF EXISTS `coupons`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `coupons` (
  `id` int NOT NULL AUTO_INCREMENT,
  `code` varchar(50) NOT NULL,
  `description` text,
  `discount_type` enum('flat','percent') NOT NULL,
  `discount_value` decimal(10,2) NOT NULL,
  `min_order_value` decimal(10,2) DEFAULT '0.00',
  `max_discount` decimal(10,2) DEFAULT NULL,
  `expires_at` datetime DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `coupons`
--

LOCK TABLES `coupons` WRITE;
/*!40000 ALTER TABLE `coupons` DISABLE KEYS */;
INSERT INTO `coupons` VALUES (1,'RR1','new customers','percent',20.00,200.00,30.00,'2025-07-16 11:11:00',1,'2025-07-09 16:42:05','2025-07-09 16:44:11'),(2,'first customer','save','flat',20.00,200.00,30.00,'2025-07-31 12:55:00',1,'2025-07-11 12:55:26','2025-07-11 12:55:26');
/*!40000 ALTER TABLE `coupons` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `deliveries`
--

DROP TABLE IF EXISTS `deliveries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `deliveries` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_id` int DEFAULT NULL,
  `delivery_person_id` int DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `assigned_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `delivered_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  KEY `delivery_person_id` (`delivery_person_id`),
  CONSTRAINT `deliveries_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `order_status` (`id`) ON DELETE CASCADE,
  CONSTRAINT `deliveries_ibfk_2` FOREIGN KEY (`delivery_person_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `deliveries`
--

LOCK TABLES `deliveries` WRITE;
/*!40000 ALTER TABLE `deliveries` DISABLE KEYS */;
INSERT INTO `deliveries` VALUES (1,1,5,'delivered','2025-07-11 13:57:03','2025-07-11 14:16:29'),(2,3,5,'delivered','2025-07-11 14:17:55','2025-07-11 14:18:08'),(3,2,5,'delivered','2025-07-11 14:18:00','2025-07-11 14:18:11');
/*!40000 ALTER TABLE `deliveries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `feedback`
--

DROP TABLE IF EXISTS `feedback`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `feedback` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  `rating` int DEFAULT NULL,
  `comments` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `feedback_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `feedback_chk_1` CHECK ((`rating` between 1 and 5))
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `feedback`
--

LOCK TABLES `feedback` WRITE;
/*!40000 ALTER TABLE `feedback` DISABLE KEYS */;
INSERT INTO `feedback` VALUES (1,7,'Satish',5,'Good','2025-07-11 14:54:05');
/*!40000 ALTER TABLE `feedback` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `food_items`
--

DROP TABLE IF EXISTS `food_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `food_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `item_code` varchar(20) NOT NULL,
  `name` varchar(100) NOT NULL,
  `category_id` int NOT NULL,
  `food_type` varchar(50) DEFAULT NULL,
  `combo_type` varchar(50) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `subcontent` varchar(255) DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `item_code` (`item_code`),
  KEY `category_id` (`category_id`),
  CONSTRAINT `food_items_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=82 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `food_items`
--

LOCK TABLES `food_items` WRITE;
/*!40000 ALTER TABLE `food_items` DISABLE KEYS */;
INSERT INTO `food_items` VALUES (1,'FC1','SPL. VEG. FRIED RICE',1,'VEG','REGULAR',100.00,'Healthy veggie delight','/uploads/items/fc1.jpg'),(2,'FC2','SPL. JEERA RICE',1,'VEG','REGULAR',100.00,'Aromatic cumin-infused rice','/uploads/items/fc2.jpg'),(3,'FC3','SPL. GOBI FRIED RICE',1,'VEG','REGULAR',120.00,'Crispy gobi goodness','/uploads/items/fc3.jpg'),(4,'FC4','SCHEZWAN FRIED RICE',1,'VEG','REGULAR',120.00,'Schezwan spice explosion','/uploads/items/fc4.jpg'),(5,'FC5','SPL. EGG FRIED RICE',1,'NON VEG','REGULAR',120.00,'Eggy and flavorful','/uploads/items/fc5.jpg'),(6,'FC6','SPL.PANEER FRIED RICE',1,'VEG','REGULAR',150.00,'Creamy paneer richness','/uploads/items/fc6.jpg'),(7,'FC7','SPL. MUSHROOM FRIED RICE',1,'VEG','REGULAR',150.00,'Mushroom-packed punch','/uploads/items/fc7.jpg'),(8,'FC8','SPL. KAJU FRIED RICE',1,'VEG','REGULAR',150.00,'Crunchy kaju blend','/uploads/items/fc8.jpg'),(9,'FC9','SCHEZWAN GOBI FRIED RICE',1,'VEG','REGULAR',150.00,'Gobi with a spicy twist','/uploads/items/fc9.jpg'),(10,'FC10','MIX GOBI & EGG FRIED RICE',1,'NON VEG','REGULAR',150.00,'Gobi meets egg fusion','/uploads/items/fc10.jpg'),(11,'FC11','MIX GOBI &  PANEER  FRIED RICE',1,'VEG','REGULAR',150.00,'Gobi-paneer perfection','/uploads/items/fc11.jpg'),(12,'FC12','CHICKEN FRIED RICE',1,'NON VEG','REGULAR',150.00,'Classic chicken indulgence','/uploads/items/fc12.jpg'),(13,'FC13','SCHEZWAN PANEER FRIED RICE',1,'VEG','REGULAR',180.00,'Schezwan paneer power','/uploads/items/fc13.jpg'),(14,'FC14','SCHEZWAN CHICKEN FRIED RICE',1,'NON VEG','REGULAR',180.00,'Fiery chicken fusion','/uploads/items/fc14.jpg'),(15,'FC15','SPL. CHICKEN FIED RICE',1,'NON VEG','REGULAR',200.00,'Special chicken delight','/uploads/items/fc15.jpg'),(16,'FC16','PRAWNS FRIED RICE',1,'NON VEG','REGULAR',200.00,'Fresh prawns flavor','/uploads/items/fc16.jpg'),(17,'FC17','MIX GOBI & KAJU FRIED RICE',1,'VEG','REGULAR',200.00,'Gobi and kaju combo','/uploads/items/fc17.jpg'),(18,'FC18','MIX PANEER & KAJU FRIED RICE',1,'VEG','REGULAR',200.00,'Rich paneer-kaju fusion','/uploads/items/fc18.jpg'),(19,'FC19','SPL. PRAWNS FRIED RICE',1,'NON VEG','REGULAR',250.00,'Signature prawns experience','/uploads/items/fc19.jpg'),(20,'FC20','SPL. VEG. NOODLES',2,'VEG','REGULAR',100.00,'Veggie noodles comfort','/uploads/items/fc20.jpg'),(21,'FC21','SPL. GOBI NOODLES',2,'VEG','REGULAR',120.00,'Gobi noodle twist','/uploads/items/fc21.jpg'),(22,'FC22','SCHEZWAN NOODLES',2,'VEG','REGULAR',120.00,'Schezwan noodle heat','/uploads/items/fc22.jpg'),(23,'FC23','SPL. EGG NOODLES',2,'NON VEG','REGULAR',120.00,'Egg noodles energy','/uploads/items/fc23.jpg'),(24,'FC24','SPL.PANEER NOODLES',2,'VEG','REGULAR',150.00,'Paneer-loaded noodles','/uploads/items/fc24.jpg'),(25,'FC25','SPL. MUSHROOM NOODLES',2,'VEG','REGULAR',150.00,'Mushroom noodle mix','/uploads/items/fc25.jpg'),(26,'FC26','SPL. KAJU NOODLES',2,'VEG','REGULAR',150.00,'Kajunoodle crunch','/uploads/items/fc26.jpg'),(27,'FC27','SCHEZWAN GOBI NOODLES',2,'VEG','REGULAR',150.00,'Spicy gobi noodles','/uploads/items/fc27.jpg'),(28,'FC28','MIX GOBI & EGG NOODLES',2,'NON VEG','REGULAR',150.00,'Egg & gobi fusion','/uploads/items/fc28.jpg'),(29,'FC29','MIX GOBI &  PANEER  NOODLES',2,'VEG','REGULAR',150.00,'Paneer-gobi combo','/uploads/items/fc29.jpg'),(30,'FC30','CHICKEN NOODLES',2,'NON VEG','REGULAR',150.00,'Juicy chicken noodles','/uploads/items/fc30.jpg'),(31,'FC31','SCHEZWAN PANEER NOODLES',2,'VEG','REGULAR',200.00,'Schezwan paneer blend','/uploads/items/fc31.jpg'),(32,'FC32','SCHEZWAN CHICKEN NOODLES',2,'NON VEG','REGULAR',200.00,'Bold chicken noodles','/uploads/items/fc32.jpg'),(33,'FC33','SPL. CHICKEN NOODLES',2,'NON VEG','REGULAR',200.00,'Premium chicken noodles','/uploads/items/fc33.jpg'),(34,'FC34','PRAWNS NOODLES',2,'NON VEG','REGULAR',200.00,'Succulent prawns noodles','/uploads/items/fc34.jpg'),(35,'FC35','MIX GOBI & KAJU NOODLES',2,'VEG','REGULAR',200.00,'Gobi-kaju blend','/uploads/items/fc35.jpg'),(36,'FC36','MIX PANEER & KAJU NOODLES',2,'VEG','REGULAR',200.00,'Paneer-kaju pairing','/uploads/items/fc36.jpg'),(37,'FC37','SPL. PRAWNS NOODLES',2,'NON VEG','REGULAR',250.00,'Prawns noodle bomb','/uploads/items/fc37.jpg'),(38,'FC38','GOBI MANCHURIA',3,'VEG','REGULAR',150.00,'Gobi delight starter','/uploads/items/fc38.jpg'),(39,'FC39','VEG MANCHURIA',3,'VEG','REGULAR',150.00,'Manchurian veggie kick','/uploads/items/fc39.jpg'),(40,'FC40','MUSHROOM-65',3,'VEG','REGULAR',200.00,'Mushroom crunch burst','/uploads/items/fc40.jpg'),(41,'FC41','MUSHROOM CHILLI',3,'VEG','REGULAR',200.00,'Zesty mushroom chili','/uploads/items/fc41.jpg'),(42,'FC42','MUSHROOM MANCHURIA',3,'VEG','REGULAR',200.00,'Manchurian magic mashroom','/uploads/items/fc42.jpg'),(43,'FC43','PANEER MANCHURIA',3,'VEG','REGULAR',200.00,'Paneer in spicy sauce','/uploads/items/fc43.jpg'),(44,'FC44','PANEER-65',3,'VEG','REGULAR',200.00,'Crispy paneer pop','/uploads/items/fc44.jpg'),(45,'FC45','PANEER-CHILLI',3,'VEG','REGULAR',200.00,'Zingy paneer chili','/uploads/items/fc45.jpg'),(46,'FC46','CHICKEN MANCHURIA',4,'NON VEG','REGULAR',200.00,'Savory chicken starter','/uploads/items/fc46.jpg'),(47,'FC47','CHILLI CHICKEN',4,'NON VEG','REGULAR',200.00,'Bold chili chicken','/uploads/items/fc47.jpg'),(48,'FC48','CHICKEN-65',4,'NON VEG','REGULAR',200.00,'Classic chicken 65','/uploads/items/fc48.jpg'),(49,'FC49','CHICKEN LOLIPOP  (6 PCS)',4,'NON VEG','REGULAR',200.00,'Lolipop heaven (6 pcs)','/uploads/items/fc49.jpg'),(50,'FC50','PRAWNS MANCHURIA',4,'NON VEG','REGULAR',200.00,'Prawns with a punch','/uploads/items/fc50.jpg'),(51,'FC51','PRAWNS-65',4,'NON VEG','REGULAR',200.00,'Crispy prawns treat','/uploads/items/fc51.jpg'),(52,'FC52','DAL FRY + 5 ROTI',5,'VEG','REGULAR',150.00,'Comfort dal combo','/uploads/items/fc52.jpg'),(53,'FC53','PANEER BUTTER MASALA + 5 ROTI',5,'VEG','COMBOS',200.00,'Creamy paneer & roti','/uploads/items/fc53.jpg'),(54,'FC54','PALAK PANEER + 5 ROTI',5,'VEG','COMBOS',200.00,'Spinach and paneer hit','/uploads/items/fc54.jpg'),(55,'FC55','MUSHROOM CURRY + 5 ROTI',5,'VEG','COMBOS',200.00,'Earthy mushroom curry','/uploads/items/fc55.jpg'),(56,'FC56','KAJU MATAR CURRY + 5 ROTI',5,'VEG','COMBOS',200.00,'Royal kaju matar','/uploads/items/fc56.jpg'),(57,'FC57','MATAR PANEER CURRY + 5 ROTI',5,'VEG','COMBOS',200.00,'Paneer-matar blend','/uploads/items/fc57.jpg'),(58,'FC58','KAJU CURRY + 5 ROTI',5,'VEG','COMBOS',200.00,'Rich kaju curry combo','/uploads/items/fc58.jpg'),(59,'FC59','EGG CURRY + 5 ROTI',6,'NON VEG','COMBOS',150.00,'Egg curry comfort','/uploads/items/fc59.jpg'),(60,'FC60','EGG BURJI + 5 ROTI',6,'NON VEG','COMBOS',160.00,'Burji and roti pair','/uploads/items/fc60.jpg'),(61,'FC61','EGG KEEMA + 5 ROTI',6,'NON VEG','COMBOS',200.00,'Keema and roti delight','/uploads/items/fc61.jpg'),(62,'FC62','CHICKEN CURRY + 5 ROTI',6,'NON VEG','COMBOS',220.00,'Chicken curry roti combo','/uploads/items/fc62.jpg'),(63,'FC63','DOUBLE CHICKEN & EGG FRIED RICE',7,'NON VEG','COMBOS',200.00,'Double chicken & egg feast','/uploads/items/fc63.jpg'),(64,'FC64','DOUBLE CHICKEN & EGG NOODLES',7,'NON VEG','COMBOS',200.00,'Double meat noodle delight','/uploads/items/fc64.jpg'),(65,'FC65','VEG FRIED RICE & GOBI MANCHURIA',7,'VEG','COMBOS',220.00,'Veg rice & gobi pairing','/uploads/items/fc65.jpg'),(66,'FC66','VEG FRIED RICE & VEG MANCHURIA',7,'VEG','COMBOS',220.00,'Manchurian rice combo','/uploads/items/fc66.jpg'),(67,'FC67','VEG FRIED RICE & CHICKEN LOLIPOP (3 Pcs)',7,'NON VEG','COMBOS',220.00,'Fried rice & lolipop treat','/uploads/items/fc67.jpg'),(68,'FC68','EGG FRIED RICE & CHICKEN LOLIPOP (3 Pcs)',7,'NON VEG','COMBOS',250.00,'Egg rice & chicken crunch','/uploads/items/fc68.jpg'),(69,'FC69','EGG FRIED RICE & CHICKEN MANCHURIA',7,'NON VEG','COMBOS',320.00,'Manchurian chicken madness','/uploads/items/fc69.jpg'),(70,'FC70','MUSHROOM FRIED RICE & MUSHROOM CHILLI',7,'VEG','COMBOS',350.00,'Mushroom combo explosion','/uploads/items/fc70.jpg'),(71,'FC71','PANEER FRIED RICE & PANEER MANCHURIA',7,'VEG','COMBOS',350.00,'Paneer rice & manchurian','/uploads/items/fc71.jpg'),(72,'FC72','SPL. CHICKEN FRIED RICE (HALF) 500 ml WITH CHICKEN MANCHURIA  300 ml',7,'NON VEG','COMBOS',240.00,'Chicken rice with manchurian','/uploads/items/fc72.jpg'),(73,'FC73','SPL. CHICKEN FRIED RICE (HALF) 500 ml WITH GOBI MANCHURIA 30 ml',7,'NON VEG','COMBOS',240.00,'Half rice with gobi blast','/uploads/items/fc73.jpg'),(74,'FC74','SPL. EGG FRIED RICE (HALF) 500 ml WITH CHICKEN PACKED 100 GR',7,'NON VEG','COMBOS',220.00,'Egg rice & chicken chunk','/uploads/items/fc74.jpg'),(75,'FC75','SPL. VEG RICE (HALF) 300 ml WITH CHICKEN PACKED 100 GR',7,'NON VEG','COMBOS',220.00,'Veg rice with chicken punch','/uploads/items/fc75.jpg'),(76,'FC76','SPL VEG RICE (HALF) 500 ml WITH GOBI MANCHURIA - 300 ml',7,'VEG','COMBOS',220.00,'Veg rice & gobi fusion','/uploads/items/fc76.jpg'),(77,'FC77','SPL. VEG RICE (HALF) 500 ml WITH VEG MANCHURIA - 300 ml',7,'VEG','COMBOS',220.00,'Veg combo meal','/uploads/items/fc77.jpg'),(78,'FC78','SPL VEG RICE (HALF) 500 ml WITH CHICKEN MANCHURIA - 300 ml',7,'NON VEG','COMBOS',200.00,'Veg rice & chicken delight','/uploads/items/fc78.jpg'),(79,'FC79','XXTRA',7,'NON VEG','COMBOS',20.00,'Extra spicy surprise','/uploads/items/fc79.jpg'),(80,'FC80','EGG 2E',7,'NON VEG','COMBOS',20.00,'Double egg burst','/uploads/items/fc80.jpg'),(81,'FC81','EGG',7,'VEG','COMBOS',10.00,'Simple and classic egg','/uploads/items/fc81.jpg');
/*!40000 ALTER TABLE `food_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `keywords`
--

DROP TABLE IF EXISTS `keywords`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `keywords` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `keywords`
--

LOCK TABLES `keywords` WRITE;
/*!40000 ALTER TABLE `keywords` DISABLE KEYS */;
INSERT INTO `keywords` VALUES (1,'CHICKEN'),(2,'EGG'),(3,'GOBI'),(4,'MANCHURIA'),(5,'MUSHROOM'),(6,'PANEER'),(7,'PRAWNS'),(8,'SCHEZWAN');
/*!40000 ALTER TABLE `keywords` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_status`
--

DROP TABLE IF EXISTS `order_status`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_status` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `items` json DEFAULT NULL,
  `subtotal` decimal(10,2) DEFAULT NULL,
  `discount` decimal(10,2) DEFAULT NULL,
  `delivery_charge` decimal(10,2) DEFAULT NULL,
  `taxes` decimal(10,2) DEFAULT NULL,
  `total` decimal(10,2) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `status` varchar(50) DEFAULT 'pending',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `address_id` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_status`
--

LOCK TABLES `order_status` WRITE;
/*!40000 ALTER TABLE `order_status` DISABLE KEYS */;
INSERT INTO `order_status` VALUES (1,6,'[{\"name\": \"SPL. PRAWNS FRIED RICE\", \"price\": \"250.00\", \"quantity\": 1, \"image_url\": \"/uploads/items/fc19.jpg\", \"item_code\": \"\"}]',250.00,20.00,20.00,20.00,270.00,'2025-07-11 13:50:46','delivered','2025-07-11 13:57:42',1),(2,6,'[{\"name\": \"SPL. PRAWNS FRIED RICE\", \"price\": \"250.00\", \"quantity\": 2, \"image_url\": \"/uploads/items/fc19.jpg\", \"item_code\": \"\"}]',500.00,20.00,20.00,20.00,520.00,'2025-07-11 14:00:50','delivered','2025-07-11 14:18:11',1),(3,6,'[{\"id\": 59, \"name\": \"EGG CURRY + 5 ROTI\", \"price\": \"150.00\", \"quantity\": 2, \"image_url\": \"/uploads/items/fc59.jpg\", \"item_code\": \"\"}, {\"id\": 52, \"name\": \"DAL FRY + 5 ROTI\", \"price\": \"150.00\", \"quantity\": 1, \"image_url\": \"/uploads/items/fc52.jpg\", \"item_code\": \"\"}, {\"id\": 46, \"name\": \"CHICKEN MANCHURIA\", \"price\": \"200.00\", \"quantity\": 2, \"image_url\": \"/uploads/items/fc46.jpg\", \"item_code\": \"\"}]',850.00,20.00,20.00,20.00,870.00,'2025-07-11 14:13:49','delivered','2025-07-11 14:18:08',1),(4,6,'[{\"id\": 19, \"name\": \"SPL. PRAWNS FRIED RICE\", \"price\": \"250.00\", \"quantity\": 1, \"image_url\": \"/uploads/items/fc19.jpg\", \"item_code\": \"\"}]',250.00,20.00,20.00,20.00,270.00,'2025-07-14 08:46:10','pending','2025-07-14 08:46:10',1),(5,6,'[{\"id\": 19, \"name\": \"SPL. PRAWNS FRIED RICE\", \"price\": \"250.00\", \"quantity\": 1, \"image_url\": \"/uploads/items/fc19.jpg\", \"item_code\": \"\"}]',250.00,0.00,20.00,20.00,290.00,'2025-07-14 08:47:04','pending','2025-07-14 08:47:04',1);
/*!40000 ALTER TABLE `order_status` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `otp_verifications`
--

DROP TABLE IF EXISTS `otp_verifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `otp_verifications` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `otp_code` varchar(10) DEFAULT NULL,
  `expires_at` datetime DEFAULT NULL,
  `verified` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `otp_verifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `otp_verifications`
--

LOCK TABLES `otp_verifications` WRITE;
/*!40000 ALTER TABLE `otp_verifications` DISABLE KEYS */;
INSERT INTO `otp_verifications` VALUES (1,1,'959587','2025-07-14 14:38:36',1);
/*!40000 ALTER TABLE `otp_verifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role_permissions`
--

DROP TABLE IF EXISTS `role_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `role_permissions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `role` varchar(255) DEFAULT NULL,
  `page_key` varchar(255) DEFAULT NULL,
  `can_view` tinyint(1) DEFAULT '0',
  `can_create` tinyint(1) DEFAULT '0',
  `can_edit` tinyint(1) DEFAULT '0',
  `can_delete` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role_permissions`
--

LOCK TABLES `role_permissions` WRITE;
/*!40000 ALTER TABLE `role_permissions` DISABLE KEYS */;
INSERT INTO `role_permissions` VALUES (1,'superadmin','dashboard',1,1,1,1),(2,'superadmin','control',1,1,1,1),(3,'superadmin','usersdata',1,1,1,1),(4,'superadmin','orders',1,1,1,1),(5,'superadmin','categories',1,1,1,1),(6,'superadmin','food_items',1,1,1,1),(7,'superadmin','coupons',1,1,1,1),(8,'superadmin','delivery',1,1,1,1),(9,'admin','dashboard',1,1,1,1),(10,'admin','delivery',0,0,0,0),(11,'admin','usersdata',1,1,1,0),(12,'admin','orders',1,1,1,1),(13,'admin','categories',1,1,1,1),(14,'admin','food_items',1,1,1,1),(15,'admin','coupons',1,1,1,1),(16,'manager','dashboard',1,0,0,0),(17,'manager','orders',1,1,1,1),(18,'manager','categories',1,0,0,0),(19,'manager','food_items',1,0,0,0),(20,'delivery','delivery',1,1,1,1),(21,'superadmin','newsection',1,1,1,1),(22,'admin','newsection',1,1,1,1),(23,'superadmin','feedback',1,1,1,1),(24,'admin','feedback',1,1,1,1);
/*!40000 ALTER TABLE `role_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `settings`
--

DROP TABLE IF EXISTS `settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `settings` (
  `id` int NOT NULL,
  `delivery_charge` decimal(10,2) NOT NULL,
  `taxes` decimal(10,2) NOT NULL,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `settings`
--

LOCK TABLES `settings` WRITE;
/*!40000 ALTER TABLE `settings` DISABLE KEYS */;
INSERT INTO `settings` VALUES (1,20.00,20.00,'2025-07-11 07:18:25');
/*!40000 ALTER TABLE `settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `mobile` varchar(20) DEFAULT NULL,
  `password_hash` text,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `role` varchar(225) DEFAULT NULL,
  `blocked` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `mobile` (`mobile`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Tarun','tarunkoduru09@gmail.com','6300184307','$2b$10$WAgoh8Xbhf0Ec6rcSEI3GeJ84aQtogZVTpW1N6m6wE.fFD1xpj/8y','2025-07-09 16:28:48','2025-07-14 14:38:11','superadmin',0),(2,'Vinod','Vinod@gmail.com','9177813103','$2b$10$XoCS9W8mTs57ttTMtlqvS.NP.5d9KDe5EfUaMjw3tap8ZnEsBim2W','2025-07-09 16:37:01','2025-07-09 16:37:27','superadmin',0),(3,'siva','siva@gmail.com','9188813103','$2b$10$1dKCL/bXNQt/rIULX625TO4CBA9ZeuJwkSR9L05ppVMs4upUDiMZS','2025-07-09 16:38:03','2025-07-09 16:38:03','admin',0),(4,'dev','dev@gmail.com','6311184307','$2b$10$iFEGc5M0WsbEMTa7eZLxCu/U7s5YG0nrkGCSWN8luXpx6p5iSO8kK','2025-07-09 16:38:30','2025-07-09 16:38:30','manager',0),(5,'ravi','ravi@gmail.com','9155813103','$2b$10$jvXhusOt36/Pxo72SmHRduOMosQLbqp4jrkpEXqKZ5cOQ8s.uu05e','2025-07-09 16:39:03','2025-07-09 16:39:03','delivery',0),(6,'mani','mani@gmail.com','6177813103','$2b$10$tdwhdCGW7slC6XIigdx2beq0FLRXssSCWRxcf0EJgmrhhJamTyGM6','2025-07-09 16:40:19','2025-07-09 16:40:19','user',0),(7,'Satish','satish@gmail.com','6200184304','$2b$10$ixgkOPG393QFUrSINR80oe3aKqRouUvCu2YhXcp3ca.wVGbGEFc3q','2025-07-10 09:22:16','2025-07-10 09:22:16','user',0);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `whats_new_items`
--

DROP TABLE IF EXISTS `whats_new_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `whats_new_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `category_id` int NOT NULL,
  `food_item_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `category_id` (`category_id`),
  KEY `food_item_id` (`food_item_id`),
  CONSTRAINT `whats_new_items_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`),
  CONSTRAINT `whats_new_items_ibfk_2` FOREIGN KEY (`food_item_id`) REFERENCES `food_items` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `whats_new_items`
--

LOCK TABLES `whats_new_items` WRITE;
/*!40000 ALTER TABLE `whats_new_items` DISABLE KEYS */;
INSERT INTO `whats_new_items` VALUES (1,7,71),(2,1,19),(3,2,37),(4,3,44),(5,4,48),(6,5,56),(7,6,62);
/*!40000 ALTER TABLE `whats_new_items` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-07-29 10:25:27
