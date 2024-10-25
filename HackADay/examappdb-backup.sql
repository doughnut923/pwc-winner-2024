/*
SQLyog Community v13.2.1 (64 bit)
MySQL - 9.0.0 : Database - examappdb
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`examappdb` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `examappdb`;

/*Table structure for table `t_authority` */

DROP TABLE IF EXISTS `t_authority`;

CREATE TABLE `t_authority` (
  `id` bigint NOT NULL COMMENT 'primay key of authority table',
  `username` varchar(50) NOT NULL COMMENT 'unique username',
  `permission` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `t_authority` */

insert  into `t_authority`(`id`,`username`,`permission`) values 
(1849733385684840450,'Jacky2','student'),
(1849733467670900739,'Jacky','student'),
(1849733605411844099,'Teacher Jacky','teacher'),
(1849779717833355266,'Jacky','Linear algebra'),
(1849779717833355267,'Jacky','University Calculus');

/*Table structure for table `t_exam` */

DROP TABLE IF EXISTS `t_exam`;

CREATE TABLE `t_exam` (
  `classname` varchar(20) NOT NULL COMMENT 'classes',
  `starting_time` timestamp NOT NULL COMMENT 'starting time of the exam',
  `ending_time` timestamp NOT NULL COMMENT 'ending time of the exam',
  `content` text COMMENT 'exam content',
  PRIMARY KEY (`classname`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `t_exam` */

insert  into `t_exam`(`classname`,`starting_time`,`ending_time`,`content`) values 
('Linear algebra','2024-10-01 17:00:00','2024-11-25 19:00:00','Final Exam covering chapters 1-10.'),
('Probability','2024-09-21 17:00:00','2024-09-25 19:00:00','Final Exam covering chapters 1-10.'),
('University Calculus','2024-11-21 17:00:00','2024-11-25 19:00:00','Final Exam covering chapters 1-10.');

/*Table structure for table `t_user` */

DROP TABLE IF EXISTS `t_user`;

CREATE TABLE `t_user` (
  `id` bigint NOT NULL COMMENT 'unique id',
  `username` varchar(50) NOT NULL COMMENT 'unique username',
  `password` char(60) NOT NULL COMMENT 'password in bcrypt',
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `t_user` */

insert  into `t_user`(`id`,`username`,`password`) values 
(1849733385672257538,'Jacky2','$2a$10$bRXDh/wNT3oVZH2u6DyHSOm8Y9pvG44eZc8ZbnE64N2BJyqoGglFe'),
(1849733467670900738,'Jacky','$2a$10$E8k97zrYvQXc.LU7rqDnBeX5PJqjHCj.3n/ETQGwxQIYkBOQAohrq'),
(1849733605411844098,'Teacher Jacky','$2a$10$VaCUvmhF1XCYUWBo/9faT.QicKLJmZX1DSoKOfzFJXZCIM0y/wgWm');

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
