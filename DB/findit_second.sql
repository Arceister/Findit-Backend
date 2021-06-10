-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Jun 10, 2021 at 07:25 AM
-- Server version: 10.4.14-MariaDB
-- PHP Version: 7.4.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `findit`
--

-- --------------------------------------------------------

--
-- Table structure for table `angkot`
--

CREATE TABLE `angkot` (
  `id` int(11) NOT NULL,
  `kode` varchar(10) NOT NULL,
  `awal` varchar(20) NOT NULL,
  `tujuan` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `angkot`
--

INSERT INTO `angkot` (`id`, `kode`, `awal`, `tujuan`) VALUES
(1, 'YNTKTS', 'Sigura-Gura', 'Veteran'),
(2, 'YTBJTS', 'Sigura-Gura', 'Soekarno Hatta');

-- --------------------------------------------------------

--
-- Table structure for table `angkots`
--

CREATE TABLE `angkots` (
  `id` int(11) NOT NULL,
  `id_angkot` int(11) DEFAULT NULL,
  `id_supir` int(11) DEFAULT NULL,
  `isAvailable` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `angkots`
--

INSERT INTO `angkots` (`id`, `id_angkot`, `id_supir`, `isAvailable`) VALUES
(1, 1, 1, 0);

-- --------------------------------------------------------

--
-- Table structure for table `barang`
--

CREATE TABLE `barang` (
  `id` int(11) NOT NULL,
  `id_pengirim` int(11) DEFAULT NULL,
  `nama_barang` varchar(30) NOT NULL,
  `tujuan_lat` decimal(10,8) DEFAULT NULL,
  `tujuan_long` decimal(11,8) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `history_user`
--

CREATE TABLE `history_user` (
  `id` int(11) NOT NULL,
  `id_user` int(11) DEFAULT NULL,
  `id_angkot` int(11) DEFAULT NULL,
  `isDijemput` tinyint(1) DEFAULT NULL,
  `harga` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `rute_angkot`
--

CREATE TABLE `rute_angkot` (
  `id_angkot` int(11) NOT NULL,
  `lat` decimal(10,8) NOT NULL,
  `lng` decimal(11,8) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `rute_angkot`
--

INSERT INTO `rute_angkot` (`id_angkot`, `lat`, `lng`) VALUES
(1, '-7.95672876', '112.60571510'),
(1, '-7.95773875', '112.61180107'),
(1, '-7.95614272', '112.61382068'),
(1, '-7.96221138', '112.62578952'),
(1, '-7.95821589', '112.61930374');

-- --------------------------------------------------------

--
-- Table structure for table `supir`
--

CREATE TABLE `supir` (
  `id` int(11) NOT NULL,
  `nama` varchar(60) NOT NULL,
  `email` varchar(60) NOT NULL,
  `password` varchar(255) NOT NULL,
  `noHP` varchar(20) NOT NULL,
  `saldo` int(11) NOT NULL,
  `id_angkot` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `supir`
--

INSERT INTO `supir` (`id`, `nama`, `email`, `password`, `noHP`, `saldo`, `id_angkot`) VALUES
(1, 'Jack', 'a@a.com', '$2b$10$dQcl5rsgqMqpLXrNa1182u1mR2tcY4GBaabRJD88Ga6n/Ram6JlL.', '081122223333', 0, 1);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `nama` varchar(100) NOT NULL,
  `email` varchar(60) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `noHP` varchar(20) DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `alamatLat` decimal(10,8) DEFAULT NULL,
  `alamatLong` decimal(11,8) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `nama`, `email`, `password`, `noHP`, `createdAt`, `alamatLat`, `alamatLong`) VALUES
(8, 'Jagad', 'h@a.com', '$2b$10$GJCGNXMLx8voXRP9n/e7renVaWfwnfSyq6UBGJEIaH6vtePi6BteC', '081294113399', '2021-06-03 14:16:46', '-6.20580754', '106.89145707'),
(9, 'Jagad', 'i@a.com', '$2b$10$iaw2P8JegaOk3icffuT76eVnXG7vORaQbUZsHR6.bFjxc22HvPjL.', '081294119399', '2021-06-04 17:35:21', '-6.20580754', '106.89145707'),
(10, 'Jagad', 'j@a.com', '$2b$10$3ey1jW4sCShnGa5.beFEN.EQhPhafwn9aUECtLr.DBXzagnuoPf1a', '081294119499', '2021-06-06 15:35:47', '-7.95599509', '112.60817387'),
(11, 'penumpang', 'penumpang@gmail.com', '$2b$10$10RTRwVBcJpw2LYEsCHkSuG5udiSjnP5JzdCg0RMmeOW4j9viUQT6', '0812345678', '2021-06-08 13:28:50', NULL, NULL),
(12, 'tes', 'tes@gmail.com', '$2b$10$YFBSeHxriyM7GlKUwCvir.NvmE6E6MaO0GBC09eNCV.U3Z2Zfsure', '08134502819', '2021-06-09 15:54:14', '-5.13819980', '119.40638940');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `angkot`
--
ALTER TABLE `angkot`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `angkots`
--
ALTER TABLE `angkots`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_angkot` (`id_angkot`),
  ADD KEY `id_supir` (`id_supir`);

--
-- Indexes for table `barang`
--
ALTER TABLE `barang`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_pengirim` (`id_pengirim`);

--
-- Indexes for table `history_user`
--
ALTER TABLE `history_user`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_user` (`id_user`),
  ADD KEY `id_angkot` (`id_angkot`);

--
-- Indexes for table `rute_angkot`
--
ALTER TABLE `rute_angkot`
  ADD KEY `id_angkot` (`id_angkot`);

--
-- Indexes for table `supir`
--
ALTER TABLE `supir`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `angkot`
--
ALTER TABLE `angkot`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `angkots`
--
ALTER TABLE `angkots`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `barang`
--
ALTER TABLE `barang`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `history_user`
--
ALTER TABLE `history_user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `supir`
--
ALTER TABLE `supir`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `angkots`
--
ALTER TABLE `angkots`
  ADD CONSTRAINT `angkots_ibfk_1` FOREIGN KEY (`id_angkot`) REFERENCES `angkot` (`id`),
  ADD CONSTRAINT `angkots_ibfk_2` FOREIGN KEY (`id_supir`) REFERENCES `supir` (`id`);

--
-- Constraints for table `barang`
--
ALTER TABLE `barang`
  ADD CONSTRAINT `barang_ibfk_1` FOREIGN KEY (`id_pengirim`) REFERENCES `users` (`id`);

--
-- Constraints for table `history_user`
--
ALTER TABLE `history_user`
  ADD CONSTRAINT `history_user_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `history_user_ibfk_2` FOREIGN KEY (`id_angkot`) REFERENCES `angkots` (`id`);

--
-- Constraints for table `rute_angkot`
--
ALTER TABLE `rute_angkot`
  ADD CONSTRAINT `rute_angkot_ibfk_1` FOREIGN KEY (`id_angkot`) REFERENCES `angkot` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
