-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: mysql-3194fc67-ut-0357.d.aivencloud.com    Database: defaultdb
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
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ '23c90c00-4d7e-11f1-b8ee-c2aac698b145:1-15,
c8b83660-31d9-11f1-b3fe-e27eaf5f1260:1-34';

--
-- Table structure for table `reservas`
--

DROP TABLE IF EXISTS `reservas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reservas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` text NOT NULL,
  `fecha` date NOT NULL,
  `hora_inicio` time NOT NULL,
  `hora_fin` time NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=92 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reservas`
--

LOCK TABLES `reservas` WRITE;
/*!40000 ALTER TABLE `reservas` DISABLE KEYS */;
INSERT INTO `reservas` VALUES (25,'Claudia Alejandra Terra Guerra ','2026-02-04','08:00:00','13:00:00'),(26,'Claudia Alejandra Terra Guerra Eccl','2026-02-25','08:00:00','13:00:00'),(27,'Equipo pedagogico de centro ','2026-02-12','14:00:00','18:00:00'),(28,'Gustavo Gallego','2026-02-05','08:00:00','12:00:00'),(29,'Gustavo Gallego','2026-02-05','13:00:00','17:00:00'),(30,'CLAUDIA ALEJANDRA TERRA ECCL','2026-02-03','13:00:00','17:00:00'),(33,'Claudia Alejandra terra Eccl','2026-02-04','14:00:00','18:00:00'),(34,'Marilyn Rodríguez leon -Alerta temprana ','2026-02-12','08:00:00','12:30:00'),(35,'Carolina Almanza ','2026-02-06','13:00:00','17:00:00'),(36,'Carolina Almanza','2026-02-09','11:00:00','16:00:00'),(37,'YOJANA BRIÑEZ','2026-02-09','08:30:00','09:30:00'),(38,'Gustavo Gallego','2026-02-06','10:45:00','12:00:00'),(39,'WILMAN HERNÀN CORREA Etapa productiva','2026-02-10','14:00:00','16:00:00'),(40,'COMITÉ PRIMARIO - SUBDIRECCIÓN ','2026-02-10','16:00:00','17:00:00'),(41,'Claudia Alejandra Terra Guerra ECCL-UMATA','2026-02-18','10:00:00','12:01:00'),(42,'Valentina Duque Muñoz- CONTRATACIÓN','2026-02-16','10:00:00','12:00:00'),(43,'Reunión del Área de Bienestar','2026-02-11','14:00:00','16:00:00'),(44,'REUNIÓN DE EMPALME DE APOYOS DE SOSTENIMIENTO','2026-02-11','10:00:00','12:00:00'),(46,'Claudia Alejandra Terra Guerra - ECCL','2026-02-17','14:00:00','18:00:00'),(47,'Hector Mauricio Ortiz Robledo','2026-02-17','09:00:00','11:00:00'),(48,'HECTOR MAURICIO ORTIZ ROBLEDO','2026-02-16','14:00:00','15:00:00'),(49,'Natalia Marulanda Méndez','2026-02-13','11:30:00','12:00:00'),(50,'Transferencia de conocimiento alternativas etapa productiva y contrato de aprendizaje','2026-02-16','15:00:00','17:00:00'),(51,'CAROLINA ALMANZA','2026-02-17','11:00:00','13:00:00'),(52,'Natalia Marulanda Méndez - Catalina Villamar','2026-02-18','08:00:00','08:55:00'),(53,'REUNIÓN EQUIPO TO','2026-02-23','09:00:00','10:00:00'),(55,'Natalia Marulanda Méndez - ASOHOFRUCOL','2026-02-23','10:00:00','12:00:00'),(56,'Claudia Alejandra Terra Guerra ','2026-02-19','16:00:00','18:00:00'),(57,'Gustavo Gallego - TGO Producción Ganadera 3171932','2026-02-23','14:30:00','15:30:00'),(58,'CAROLINA ALMANZA','2026-02-24','10:00:00','12:00:00'),(59,'Cumpleaños Mauro','2026-02-24','14:30:00','18:00:00'),(60,'COMITÉ TÉCNICO DE CENTRO','2026-02-27','09:00:00','12:00:00'),(61,'COMITÉ PRIMARIO DE CENTRO - MES DE FEBRERO','2026-02-25','14:30:00','16:00:00'),(62,'REUNIÓN DE INCUMPLIMIENTO ','2026-02-26','15:00:00','17:00:00'),(63,'REUNIÓN COMPETENCIAS LABORALES CON SUBDIRECCIÓN ','2026-02-27','14:00:00','16:00:00'),(64,'COORDINACION ACADEMICA','2026-03-05','08:00:00','17:00:00'),(65,'REUNION ENCC','2026-03-04','16:00:00','17:00:00'),(66,'Comite De Granja Pecuarios, Agricolas, Agroindustria','2026-03-03','16:00:00','17:00:00'),(67,'REVISIÓN CUENTA DE RESPONSABILIDAD ELIANA SALINAS','2026-03-04','14:00:00','16:00:00'),(68,'SEGUIMIENTO A CONTRATACIÓN ','2026-03-06','15:30:00','18:00:00'),(69,'Reunión del Tecnólogo en Actividad Física','2026-03-04','09:00:00','10:30:00'),(70,'Preparación para la Visita de Pares Académicos – Tecnología en Gestión Integral de Proyectos','2026-03-05','14:00:00','16:00:00'),(71,'REUNIÓN SST Y SUBDIRECCION','2026-03-11','14:00:00','15:00:00'),(73,'REUNIÓN CON YOJANA SUBDIRECCION Y COORDINACION DE FORMACIÓN','2026-03-05','17:00:00','18:00:00'),(74,'REUNIÓN TABLAS DE RETENCIÓN SENNOVA','2026-03-09','15:30:00','17:30:00'),(75,'REUNIÓN TABLAS DE RETENCIÓN CON BIENESTAR','2026-03-10','08:30:00','11:00:00'),(76,'VISITA DE PARESS ACADEMICO-Tecnología en Gestión Integral de Proyectos','2026-03-12','07:30:00','18:00:00'),(77,'VISITA DE PARESS ACADEMICO-Tecnología en Gestión Integral de Proyectos','2026-03-13','07:30:00','17:40:00'),(78,'CAROLINA ALMANZA','2026-03-11','08:00:00','11:00:00'),(79,'Hector Mauricio Ortiz Robledo','2026-03-20','08:00:00','12:00:00'),(80,'Claudia Alejandra Terra Guerra ','2026-03-17','13:00:00','18:00:00'),(81,'CAROLINA ALMANZA','2026-03-16','14:00:00','16:00:00'),(82,'EQUIPO PEDAGOGICO DE CENTRO ','2026-03-27','14:00:00','18:00:00'),(83,'REUNION DE EQUIPO ECCL -CLAUDIA TERRA','2026-03-25','08:00:00','13:32:00'),(84,'TALLER PQRS','2026-03-19','10:00:00','11:30:00'),(85,'El gran evento - Julian Tato','2026-03-20','14:00:00','16:00:00'),(86,'CAROLINA ALMANZA','2026-04-08','13:00:00','16:00:00'),(88,'Revisión MINCIT','2026-04-07','08:00:00','12:00:00'),(89,'Gustavo Gallego','2026-03-26','14:00:00','15:00:00'),(90,'REUNION EQUIPO ECCL','2026-04-09','09:00:00','12:00:00');
/*!40000 ALTER TABLE `reservas` ENABLE KEYS */;
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

-- Dump completed on 2026-05-12  8:57:54
