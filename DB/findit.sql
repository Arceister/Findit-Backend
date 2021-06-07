-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Jun 07, 2021 at 09:21 AM
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
  `tujuan` varchar(20) NOT NULL,
  `awal_lat` decimal(10,8) NOT NULL,
  `awal_long` decimal(11,8) NOT NULL,
  `tujuan_lat` decimal(10,8) NOT NULL,
  `tujuan_long` decimal(11,8) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `angkot`
--

INSERT INTO `angkot` (`id`, `kode`, `awal`, `tujuan`, `awal_lat`, `awal_long`, `tujuan_lat`, `tujuan_long`) VALUES
(1, 'YNTKTS', 'Sigura-Gura', 'Veteran', '-7.95692588', '112.60575944', '-7.96217461', '112.62595084'),
(2, 'YTBJTS', 'Sigura-Gura', 'Soekarno Hatta', '-7.95692588', '112.60575944', '-7.93710452', '112.62613050');

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
-- Table structure for table `supir`
--

CREATE TABLE `supir` (
  `id` int(11) NOT NULL,
  `nama` varchar(60) NOT NULL,
  `email` varchar(60) NOT NULL,
  `password` varchar(255) NOT NULL,
  `noHP` varchar(20) NOT NULL,
  `saldo` int(11) NOT NULL,
  `kode_angkot` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

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
(10, 'Jagad', 'j@a.com', '$2b$10$3ey1jW4sCShnGa5.beFEN.EQhPhafwn9aUECtLr.DBXzagnuoPf1a', '081294119499', '2021-06-06 15:35:47', '-7.95599509', '112.60817387');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `angkot`
--
ALTER TABLE `angkot`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `barang`
--
ALTER TABLE `barang`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_pengirim` (`id_pengirim`);

--
-- Indexes for table `supir`
--
ALTER TABLE `supir`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `kode_angkot` (`kode_angkot`);

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
-- AUTO_INCREMENT for table `barang`
--
ALTER TABLE `barang`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `supir`
--
ALTER TABLE `supir`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `barang`
--
ALTER TABLE `barang`
  ADD CONSTRAINT `barang_ibfk_1` FOREIGN KEY (`id_pengirim`) REFERENCES `users` (`id`);

--
-- Constraints for table `supir`
--
ALTER TABLE `supir`
  ADD CONSTRAINT `supir_ibfk_1` FOREIGN KEY (`kode_angkot`) REFERENCES `angkot` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
