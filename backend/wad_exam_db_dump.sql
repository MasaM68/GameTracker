-- MySQL dump 10.13  Distrib 8.0.45, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: wad_exam_db
-- ------------------------------------------------------
-- Server version	8.0.45

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `review`
--

DROP TABLE IF EXISTS `review`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `review` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `anime_id` int NOT NULL,
  `rating` tinyint unsigned NOT NULL,
  `comment` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `review`
--

LOCK TABLES `review` WRITE;
/*!40000 ALTER TABLE `review` DISABLE KEYS */;
INSERT INTO `review` VALUES (1,1,1,8,'fhnjsdjhnws'),(2,1,57555,8,'gjmk'),(3,1,5114,9,'hnk,j'),(4,3,57555,10,'gbj '),(5,3,11061,3,'hjukhg');
/*!40000 ALTER TABLE `review` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_user_username` (`username`),
  UNIQUE KEY `uq_user_email` (`email`),
  UNIQUE KEY `uq_user_id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (3,'test','test@mail.com','$2b$10$dgkYNy5eNAS4joTg4NUlnuC9ovC58OE1AjmCjEB6BkB94Xa0u2J9K');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `watch_status`
--

DROP TABLE IF EXISTS `watch_status`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `watch_status` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `anime_id` int unsigned NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` enum('watching','completed','plan_to_watch','dropped') NOT NULL DEFAULT 'plan_to_watch',
  `is_favorite` tinyint unsigned NOT NULL DEFAULT '0',
  `title` varchar(255) DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `watch_status`
--

LOCK TABLES `watch_status` WRITE;
/*!40000 ALTER TABLE `watch_status` DISABLE KEYS */;
INSERT INTO `watch_status` VALUES (10,1,52991,'2026-03-16 21:55:46','plan_to_watch',0,'Sousou no Frieren','https://myanimelist.net/images/anime/1015/138006.jpg'),(11,1,57555,'2026-03-16 23:32:06','completed',0,'Chainsaw Man Movie: Reze-hen','https://myanimelist.net/images/anime/1763/150638.jpg'),(12,1,5114,'2026-03-17 00:33:33','completed',0,'Fullmetal Alchemist: Brotherhood','https://myanimelist.net/images/anime/1208/94745.jpg'),(13,3,57555,'2026-03-17 13:41:58','completed',0,'Chainsaw Man Movie: Reze-hen','https://myanimelist.net/images/anime/1763/150638.jpg'),(14,3,60022,'2026-03-17 13:42:06','plan_to_watch',0,'One Piece Fan Letter','https://myanimelist.net/images/anime/1455/146229.jpg'),(15,3,11061,'2026-03-17 13:42:22','dropped',0,'Hunter x Hunter (2011)','https://myanimelist.net/images/anime/1337/99013.jpg');
/*!40000 ALTER TABLE `watch_status` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-03-17 13:45:08
