-- phpMyAdmin SQL Dump
-- version 5.1.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Feb 25, 2024 at 12:03 PM
-- Server version: 5.7.24
-- PHP Version: 8.0.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `documents`
--

-- --------------------------------------------------------

--
-- Table structure for table `documents`
--

CREATE TABLE `documents` (
  `id` int(11) NOT NULL,
  `title` varchar(128) DEFAULT NULL,
  `content` text,
  `authorId` int(11) NOT NULL,
  `delete` tinyint(4) NOT NULL DEFAULT '0',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `documents`
--

INSERT INTO `documents` (`id`, `title`, `content`, `authorId`, `delete`, `createdAt`) VALUES
(3, 'Fredag morgon', '<p>Idag &auml;r det fredag och klockan &auml;r 10 p&aring; morgonen. Idag &auml;r det soligt och lite mildare. En h&auml;rlig vinterdag. Och snart &auml;r det v&aring;r! Det ser jag fram emot.</p>', 1, 0, '2024-02-16 09:03:02'),
(4, 'Mitt andra inlägg', 'Det här blir mitt andra blogginlägg', 1, 0, '2024-02-16 09:03:02'),
(5, 'Snart helg', 'Snart är det helg och vi är lediga!', 1, 0, '2024-02-16 10:36:02'),
(71, 'Snöoväder', '<h1>Sn&ouml;igt</h1>\n<p>Idag sn&ouml;ar det f&ouml;r fullt.</p>', 2, 0, '2024-02-22 13:33:13'),
(91, 'Good day', '<h1>God dagens</h1>\n<p>God dag!</p>', 2, 0, '2024-02-23 09:51:33'),
(97, 'Morning', '<p>God morgon, l&ouml;rdag!</p>', 1, 0, '2024-02-24 07:08:55'),
(98, 'First post', '<p>This is my first post.</p>', 3, 0, '2024-02-24 07:10:25'),
(99, 'Saturday morning', '<p>It\'s Saturday today.</p>', 3, 0, '2024-02-24 07:12:00'),
(100, 'Sunny day', '<p>Good morning, the sun is shining..</p>', 3, 0, '2024-02-24 07:15:34');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `userId` int(11) NOT NULL,
  `username` varchar(128) DEFAULT NULL,
  `password` varchar(128) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`userId`, `username`, `password`, `createdAt`) VALUES
(1, 'RebeckaGothlin', 'documents', '2024-02-16 09:05:48'),
(2, 'MammaMia', 'MammaMia', '2024-02-16 13:07:02'),
(3, 'Mumin', 'Mumin', '2024-02-16 13:07:02');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `documents`
--
ALTER TABLE `documents`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`userId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `documents`
--
ALTER TABLE `documents`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=102;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `userId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
