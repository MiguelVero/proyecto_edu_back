-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 25-03-2026 a las 01:40:34
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `labtrack_db`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `configuraciones`
--

CREATE TABLE `configuraciones` (
  `id` int(11) NOT NULL,
  `clave` varchar(50) NOT NULL,
  `valor` text DEFAULT NULL,
  `tipo_dato` enum('texto','numero','booleano','json') DEFAULT 'texto',
  `descripcion` text DEFAULT NULL,
  `actualizado_en` datetime NOT NULL,
  `creado_en` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `configuraciones`
--

INSERT INTO `configuraciones` (`id`, `clave`, `valor`, `tipo_dato`, `descripcion`, `actualizado_en`, `creado_en`) VALUES
(1, 'app_nombre', 'LabTrack Pro', 'texto', 'Nombre de la aplicación', '2026-03-09 16:48:09', '2026-03-10 00:51:51'),
(2, 'app_version', '1.0.0', 'texto', 'Versión actual', '2026-03-09 16:48:09', '2026-03-10 00:51:51'),
(3, 'tema_por_defecto', 'dark', 'texto', 'Tema inicial de la interfaz', '2026-03-09 16:48:09', '2026-03-10 00:51:51'),
(4, 'whatsapp_mensaje_base', 'Hola Dr(a). {doctor}, le comparto el estado de cuenta de su trabajo: {servicio}', 'texto', 'Mensaje base para WhatsApp', '2026-03-09 16:48:09', '2026-03-10 00:51:51');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `doctores`
--

CREATE TABLE `doctores` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `telefono_whatsapp` varchar(20) DEFAULT NULL,
  `logo_url` text DEFAULT NULL,
  `direccion` text DEFAULT NULL,
  `activo` tinyint(1) DEFAULT 1,
  `creado_en` datetime NOT NULL,
  `actualizado_en` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `doctores`
--

INSERT INTO `doctores` (`id`, `nombre`, `telefono_whatsapp`, `logo_url`, `direccion`, `activo`, `creado_en`, `actualizado_en`) VALUES
(1, 'erick', '51939702033', NULL, 'Pucallpa', 1, '2026-03-10 04:34:39', '2026-03-10 04:34:39'),
(2, 'paolo', '51961739701', '/uploads/doctores/1773175951018-322875341.jpg', 'jr.los guayabos mz.12', 1, '2026-03-10 20:52:31', '2026-03-10 20:52:31'),
(3, 'VELA', '51967329256', '/uploads/doctores/1773178109317.avif', 'flores mz.12', 1, '2026-03-10 21:28:29', '2026-03-10 21:28:29'),
(4, 'miki', '51989756745', '/uploads/doctores/1773191741193.png', 'Pucallpa', 1, '2026-03-11 01:15:41', '2026-03-11 01:15:41'),
(5, 'cesar', '51982736987', '/uploads/doctores/1773250422460.jpg', 'jr santa rosa', 1, '2026-03-11 17:33:17', '2026-03-11 17:33:42'),
(6, 'matias', '51934532456', '/uploads/doctores/1773282073275.jpg', 'Pucallpa', 1, '2026-03-12 02:21:13', '2026-03-12 02:21:13'),
(7, 'juan carlos', '51973892895', '/uploads/doctores/1773284612841.jpg', 'km 6', 1, '2026-03-12 03:03:32', '2026-03-12 03:03:32'),
(8, 'juana', '5193453565', '/uploads/doctores/1773546603688.webp', 'san alejandro', 1, '2026-03-15 03:50:03', '2026-03-15 03:50:03');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `logs_actividad`
--

CREATE TABLE `logs_actividad` (
  `id` int(11) NOT NULL,
  `usuario_id` int(11) DEFAULT NULL,
  `accion` varchar(50) NOT NULL,
  `entidad_tipo` varchar(50) DEFAULT NULL,
  `entidad_id` int(11) DEFAULT NULL,
  `detalle` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`detalle`)),
  `ip_direccion` varchar(45) DEFAULT NULL,
  `creado_en` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `logs_actividad`
--

INSERT INTO `logs_actividad` (`id`, `usuario_id`, `accion`, `entidad_tipo`, `entidad_id`, `detalle`, `ip_direccion`, `creado_en`) VALUES
(1, 2, 'registrar_pago', 'pago', 2, '{\"orden_id\": \"1\", \"monto\": \"20.00\", \"metodo\": \"efectivo\"}', NULL, '2026-03-10 23:15:09'),
(2, 2, 'registrar_pago', 'pago', 5, '{\"orden_id\": \"1\", \"monto\": \"380.00\", \"metodo\": \"efectivo\"}', NULL, '2026-03-11 22:38:54'),
(3, 2, 'registrar_pago', 'pago', 6, '{\"orden_id\": \"1\", \"monto\": \"380.00\", \"metodo\": \"efectivo\"}', NULL, '2026-03-11 22:38:54'),
(4, 2, 'registrar_pago', 'pago', 7, '{\"orden_id\": \"2\", \"monto\": \"500.00\", \"metodo\": \"efectivo\"}', NULL, '2026-03-11 22:58:08'),
(5, 2, 'registrar_pago', 'pago', 8, '{\"orden_id\": \"2\", \"monto\": \"300.00\", \"metodo\": \"efectivo\"}', NULL, '2026-03-11 22:59:10'),
(6, 2, 'registrar_pago', 'pago', 9, '{\"orden_id\": \"3\", \"monto\": \"70.00\", \"metodo\": \"efectivo\"}', NULL, '2026-03-11 23:02:23'),
(7, 2, 'registrar_pago', 'pago', 10, '{\"orden_id\": \"3\", \"monto\": \"100.00\", \"metodo\": \"efectivo\"}', NULL, '2026-03-11 23:05:21'),
(8, 2, 'registrar_pago', 'pago', 12, '{\"orden_id\":5,\"monto\":50,\"metodo\":\"efectivo\"}', NULL, '2026-03-12 03:06:36'),
(9, 2, 'registrar_pago', 'pago', 14, '{\"orden_id\":6,\"monto\":50,\"metodo\":\"yape\"}', NULL, '2026-03-12 18:54:42'),
(10, 2, 'registrar_pago', 'pago', 15, '{\"orden_id\":2,\"monto\":50,\"metodo\":\"yape\"}', NULL, '2026-03-12 20:07:26'),
(11, 2, 'registrar_pago', 'pago', 16, '{\"orden_id\":7,\"monto\":80,\"metodo\":\"efectivo\"}', NULL, '2026-03-12 20:23:05'),
(12, 2, 'registrar_pago', 'pago', 18, '{\"orden_id\":11,\"monto\":34,\"metodo\":\"efectivo\"}', NULL, '2026-03-15 03:56:53'),
(13, 2, 'registrar_pago', 'pago', 19, '{\"orden_id\":11,\"monto\":56,\"metodo\":\"efectivo\"}', NULL, '2026-03-15 03:56:57'),
(14, 2, 'registrar_pago', 'pago', 20, '{\"orden_id\":11,\"monto\":310,\"metodo\":\"efectivo\"}', NULL, '2026-03-15 03:57:10'),
(15, 2, 'registrar_pago', 'pago', 22, '{\"orden_id\":10,\"monto\":500,\"metodo\":\"efectivo\"}', NULL, '2026-03-17 23:51:05'),
(16, 2, 'registrar_pago', 'pago', 23, '{\"orden_id\":4,\"monto\":500,\"metodo\":\"efectivo\"}', NULL, '2026-03-17 23:51:21'),
(17, 2, 'registrar_pago', 'pago', 24, '{\"orden_id\":5,\"monto\":400,\"metodo\":\"efectivo\"}', NULL, '2026-03-17 23:52:27'),
(18, 2, 'registrar_pago', 'pago', 25, '{\"orden_id\":7,\"monto\":420,\"metodo\":\"efectivo\"}', NULL, '2026-03-17 23:53:22'),
(19, 2, 'registrar_pago', 'pago', 28, '{\"orden_id\":14,\"monto\":300,\"metodo\":\"efectivo\"}', NULL, '2026-03-18 01:21:58'),
(20, 2, 'registrar_pago', 'pago', 29, '{\"orden_id\":14,\"monto\":200,\"metodo\":\"efectivo\"}', NULL, '2026-03-18 01:22:36'),
(21, 2, 'registrar_pago', 'pago', 30, '{\"orden_id\":14,\"monto\":60,\"metodo\":\"efectivo\"}', NULL, '2026-03-18 01:22:56'),
(22, 2, 'registrar_pago', 'pago', 31, '{\"orden_id\":14,\"monto\":50,\"metodo\":\"efectivo\"}', NULL, '2026-03-18 01:23:37'),
(23, 2, 'registrar_pago', 'pago', 33, '{\"orden_id\":15,\"monto\":20,\"metodo\":\"efectivo\"}', NULL, '2026-03-18 01:48:41'),
(24, 2, 'registrar_pago', 'pago', 34, '{\"orden_id\":14,\"monto\":10,\"metodo\":\"efectivo\"}', NULL, '2026-03-18 01:52:13'),
(25, 2, 'registrar_pago', 'pago', 35, '{\"orden_id\":15,\"monto\":40,\"metodo\":\"efectivo\"}', NULL, '2026-03-18 01:53:19'),
(26, 2, 'registrar_pago', 'pago', 36, '{\"orden_id\":13,\"monto\":100,\"metodo\":\"efectivo\"}', NULL, '2026-03-18 01:56:46'),
(27, 2, 'registrar_pago', 'pago', 39, '{\"orden_id\":18,\"monto\":10,\"metodo\":\"efectivo\"}', NULL, '2026-03-24 04:22:19'),
(28, 2, 'registrar_pago', 'pago', 40, '{\"orden_id\":18,\"monto\":10,\"metodo\":\"efectivo\"}', NULL, '2026-03-24 04:22:38'),
(29, 2, 'registrar_pago', 'pago', 41, '{\"orden_id\":18,\"monto\":80,\"metodo\":\"efectivo\"}', NULL, '2026-03-24 04:22:52'),
(30, 2, 'registrar_pago', 'pago', 42, '{\"orden_id\":6,\"monto\":220,\"metodo\":\"efectivo\"}', NULL, '2026-03-24 20:42:12'),
(31, 2, 'registrar_pago', 'pago', 44, '{\"orden_id\":19,\"monto\":90,\"metodo\":\"efectivo\"}', NULL, '2026-03-24 21:47:44');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ordenes`
--

CREATE TABLE `ordenes` (
  `id` int(11) NOT NULL,
  `id_externo` varchar(50) DEFAULT NULL,
  `doctor_id` int(11) NOT NULL,
  `servicio_id` int(11) NOT NULL,
  `total` decimal(10,2) NOT NULL,
  `estado` enum('pendiente','terminado') DEFAULT 'pendiente',
  `prioridad` enum('normal','urgente','emergencia') DEFAULT 'normal',
  `fecha_registro` datetime DEFAULT NULL,
  `fecha_inicio` date DEFAULT NULL,
  `hora_inicio` time DEFAULT NULL,
  `fecha_limite` date DEFAULT NULL,
  `hora_limite` time DEFAULT NULL,
  `cliente_nombre` text DEFAULT NULL,
  `activo` tinyint(1) DEFAULT 1,
  `actualizado_en` datetime NOT NULL,
  `creado_en` datetime NOT NULL,
  `usuario_creo_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `ordenes`
--

INSERT INTO `ordenes` (`id`, `id_externo`, `doctor_id`, `servicio_id`, `total`, `estado`, `prioridad`, `fecha_registro`, `fecha_inicio`, `hora_inicio`, `fecha_limite`, `hora_limite`, `cliente_nombre`, `activo`, `actualizado_en`, `creado_en`, `usuario_creo_id`) VALUES
(1, 'ORD-1773117465012', 1, 3, 500.00, 'terminado', 'normal', '2026-03-10 04:37:45', NULL, NULL, '2026-03-17', NULL, 'sdfgwsdfg', 1, '2026-03-11 20:16:28', '2026-03-10 04:37:45', 2),
(2, 'ORD-1773191907559', 4, 7, 600.00, 'terminado', 'normal', '2026-03-11 01:18:27', NULL, NULL, '2026-03-19', NULL, '', 1, '2026-03-12 20:07:26', '2026-03-11 01:18:27', 2),
(3, 'ORD-1773250470795', 5, 1, 300.00, 'pendiente', 'normal', '2026-03-11 17:34:30', NULL, NULL, '2026-03-26', NULL, 'todo conforme', 1, '2026-03-11 20:16:28', '2026-03-11 17:34:30', 2),
(4, 'ORD-1773282234583', 6, 15, 500.00, 'terminado', 'normal', '2026-03-12 02:23:54', NULL, NULL, '2026-03-18', NULL, '', 1, '2026-03-17 23:51:21', '2026-03-12 02:23:54', 2),
(5, 'ORD-1773284754632', 7, 16, 500.00, 'terminado', 'normal', '2026-03-12 03:05:54', NULL, NULL, '2026-03-13', NULL, '', 1, '2026-03-17 23:52:27', '2026-03-12 03:05:54', 2),
(6, 'ORD-1773341453490', 3, 2, 300.00, 'terminado', 'normal', '2026-03-12 18:50:53', NULL, NULL, '2026-03-20', NULL, 'Maria gutierres flores', 1, '2026-03-24 15:42:12', '2026-03-12 18:50:53', 2),
(7, 'ORD-1773346948210', 5, 1, 500.00, 'terminado', 'normal', '2026-03-12 20:22:28', NULL, NULL, '2026-03-17', NULL, 'maria', 1, '2026-03-17 23:53:22', '2026-03-12 20:22:28', 2),
(8, 'ORD-1773349206883', 1, 17, 400.00, 'pendiente', 'normal', '2026-03-12 21:00:06', NULL, NULL, '2026-03-21', NULL, '......', 1, '2026-03-12 21:00:06', '2026-03-12 21:00:06', 2),
(9, 'ORD-1773353396481', 6, 13, 300.00, 'pendiente', 'normal', '2026-03-12 22:09:56', NULL, NULL, '2026-03-20', NULL, 'SOFIA ERNANDES', 1, '2026-03-12 22:09:56', '2026-03-12 22:09:56', 2),
(10, 'ORD-1773353604049', 2, 6, 500.00, 'terminado', 'normal', '2026-03-12 22:13:24', NULL, NULL, '2026-03-18', NULL, 'andrea patricia prieto lopez', 1, '2026-03-17 23:51:05', '2026-03-12 22:13:24', 2),
(11, 'ORD-1773546781025', 8, 18, 600.00, 'terminado', 'normal', '2026-03-15 03:53:01', NULL, NULL, '2026-03-17', NULL, 'pepe', 1, '2026-03-15 03:57:10', '2026-03-15 03:53:01', 2),
(12, 'ORD-1773547201258', 6, 4, 222.00, 'pendiente', 'normal', '2026-03-15 04:00:01', NULL, NULL, '2026-03-17', NULL, 'pedro', 1, '2026-03-15 04:00:01', '2026-03-15 04:00:01', 2),
(13, 'ORD-1773791715293', 5, 10, 300.00, 'pendiente', 'normal', '2026-03-17 23:55:15', NULL, NULL, '2026-03-23', NULL, 'jose rosas', 1, '2026-03-17 23:55:15', '2026-03-17 23:55:15', 2),
(14, 'ORD-1773796853019', 6, 2, 300.00, 'pendiente', 'normal', '2026-03-18 01:20:53', NULL, NULL, '2026-03-28', '15:40:00', 'Marta gutierres', 1, '2026-03-18 01:52:13', '2026-03-18 01:20:53', 2),
(16, 'ORD-1774315363053', 7, 16, 300.00, 'pendiente', 'normal', '2026-03-23 20:22:43', NULL, NULL, '2026-03-31', '16:30:00', 'sara contreras', 1, '2026-03-23 20:22:43', '2026-03-23 20:22:43', 2),
(17, 'ORD-1774316975409', 2, 1, 200.00, 'pendiente', 'normal', '2026-03-23 20:49:35', NULL, NULL, '2026-04-02', '14:50:00', 'vero', 1, '2026-03-23 20:49:35', '2026-03-23 20:49:35', 2),
(18, 'ORD-1774326125154', 2, 2, 100.00, 'terminado', 'normal', '2026-03-23 23:22:05', NULL, NULL, '2026-04-07', '16:20:00', 'juana', 1, '2026-03-23 23:22:52', '2026-03-23 23:22:05', 2),
(19, 'ORD-1774388333702', 1, 16, 100.00, 'terminado', 'urgente', '2026-03-24 16:38:53', NULL, NULL, '2026-03-30', '16:40:00', 'carmen espinoza', 1, '2026-03-24 16:47:44', '2026-03-24 16:38:53', 2),
(20, 'ORD-1774394616333', 5, 10, 200.00, 'pendiente', 'normal', '2026-03-24 18:23:36', NULL, NULL, '2026-04-03', '14:28:00', 'luciana', 1, '2026-03-24 18:23:36', '2026-03-24 18:23:36', 2);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pagos`
--

CREATE TABLE `pagos` (
  `id` int(11) NOT NULL,
  `orden_id` int(11) NOT NULL,
  `monto` decimal(10,2) NOT NULL,
  `metodo_pago` enum('efectivo','tarjeta','transferencia','yape','plin','deposito') DEFAULT 'efectivo',
  `observaciones` text DEFAULT NULL,
  `usuario_registro_id` int(11) DEFAULT NULL,
  `referencia` varchar(100) DEFAULT NULL,
  `creado_en` datetime NOT NULL,
  `actualizado_en` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `pagos`
--

INSERT INTO `pagos` (`id`, `orden_id`, `monto`, `metodo_pago`, `observaciones`, `usuario_registro_id`, `referencia`, `creado_en`, `actualizado_en`) VALUES
(1, 1, 100.00, 'efectivo', 'Pago inicial', 2, NULL, '2026-03-10 04:37:45', '2026-03-10 04:37:45'),
(2, 1, 20.00, 'efectivo', NULL, 2, NULL, '2026-03-10 23:15:09', '2026-03-10 23:15:09'),
(3, 2, 50.00, 'efectivo', 'Pago inicial', 2, NULL, '2026-03-11 01:18:27', '2026-03-11 01:18:27'),
(4, 3, 70.00, 'efectivo', 'Pago inicial', 2, NULL, '2026-03-11 17:34:30', '2026-03-11 17:34:30'),
(5, 1, 380.00, 'efectivo', NULL, 2, NULL, '2026-03-11 22:38:54', '2026-03-11 22:38:54'),
(7, 2, 500.00, 'efectivo', NULL, 2, 'pago completo', '2026-03-11 22:58:08', '2026-03-11 22:58:08'),
(9, 3, 70.00, 'efectivo', NULL, 2, 'deuda', '2026-03-11 23:02:23', '2026-03-11 23:02:23'),
(10, 3, 100.00, 'efectivo', NULL, 2, 'deuda', '2026-03-11 23:05:21', '2026-03-11 23:05:21'),
(11, 5, 50.00, 'efectivo', 'Pago inicial', 2, NULL, '2026-03-12 03:05:54', '2026-03-12 03:05:54'),
(12, 5, 50.00, 'efectivo', NULL, 2, '', '2026-03-12 03:06:36', '2026-03-12 03:06:36'),
(13, 6, 30.00, 'efectivo', NULL, 2, NULL, '2026-03-12 18:50:53', '2026-03-12 18:50:53'),
(14, 6, 50.00, 'yape', NULL, 2, 'abono de deuda', '2026-03-12 18:54:42', '2026-03-12 18:54:42'),
(15, 2, 50.00, 'yape', NULL, 2, 'pago completo', '2026-03-12 20:07:26', '2026-03-12 20:07:26'),
(16, 7, 80.00, 'efectivo', NULL, 2, 'abono de deuda', '2026-03-12 20:23:05', '2026-03-12 20:23:05'),
(17, 11, 200.00, 'efectivo', NULL, 2, NULL, '2026-03-15 03:53:01', '2026-03-15 03:53:01'),
(18, 11, 34.00, 'efectivo', NULL, 2, '', '2026-03-15 03:56:53', '2026-03-15 03:56:53'),
(19, 11, 56.00, 'efectivo', NULL, 2, '', '2026-03-15 03:56:57', '2026-03-15 03:56:57'),
(20, 11, 310.00, 'efectivo', NULL, 2, '', '2026-03-15 03:57:10', '2026-03-15 03:57:10'),
(21, 12, 34.00, 'efectivo', NULL, 2, NULL, '2026-03-15 04:00:01', '2026-03-15 04:00:01'),
(22, 10, 500.00, 'efectivo', NULL, 2, 'pago completo', '2026-03-17 23:51:05', '2026-03-17 23:51:05'),
(23, 4, 500.00, 'efectivo', NULL, 2, 'pago completo', '2026-03-17 23:51:21', '2026-03-17 23:51:21'),
(24, 5, 400.00, 'efectivo', NULL, 2, 'pago completo', '2026-03-17 23:52:27', '2026-03-17 23:52:27'),
(25, 7, 420.00, 'efectivo', NULL, 2, 'pago completo', '2026-03-17 23:53:22', '2026-03-17 23:53:22'),
(26, 13, 10.00, 'efectivo', NULL, 2, NULL, '2026-03-17 23:55:15', '2026-03-17 23:55:15'),
(27, 14, 20.00, 'efectivo', NULL, 2, NULL, '2026-03-18 01:20:53', '2026-03-18 01:20:53'),
(29, 14, 200.00, 'efectivo', NULL, 2, 'deuda', '2026-03-18 01:22:36', '2026-03-18 01:22:36'),
(30, 14, 60.00, 'efectivo', NULL, 2, 'deuda', '2026-03-18 01:22:56', '2026-03-18 01:22:56'),
(34, 14, 10.00, 'efectivo', NULL, 2, '', '2026-03-18 01:52:13', '2026-03-18 01:52:13'),
(36, 13, 100.00, 'efectivo', NULL, 2, 'deuda', '2026-03-18 01:56:46', '2026-03-18 01:56:46'),
(37, 16, 10.00, 'efectivo', NULL, 2, NULL, '2026-03-23 20:22:43', '2026-03-23 20:22:43'),
(38, 17, 20.00, 'efectivo', NULL, 2, NULL, '2026-03-23 20:49:35', '2026-03-23 20:49:35'),
(39, 18, 10.00, 'efectivo', NULL, 2, '', '2026-03-23 23:22:19', '2026-03-23 23:22:19'),
(40, 18, 10.00, 'efectivo', NULL, 2, '', '2026-03-23 23:22:38', '2026-03-23 23:22:38'),
(41, 18, 80.00, 'efectivo', NULL, 2, '', '2026-03-23 23:22:52', '2026-03-23 23:22:52'),
(42, 6, 220.00, 'efectivo', NULL, 2, '', '2026-03-24 15:42:12', '2026-03-24 15:42:12'),
(43, 19, 10.00, 'efectivo', NULL, 2, NULL, '2026-03-24 16:38:53', '2026-03-24 16:38:53'),
(44, 19, 90.00, 'efectivo', NULL, 2, '', '2026-03-24 16:47:44', '2026-03-24 16:47:44');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `servicios`
--

CREATE TABLE `servicios` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `precio_referencial` decimal(10,2) DEFAULT NULL,
  `activo` tinyint(1) DEFAULT 1,
  `creado_en` datetime NOT NULL,
  `actualizado_en` datetime NOT NULL,
  `imagen_url` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `servicios`
--

INSERT INTO `servicios` (`id`, `nombre`, `precio_referencial`, `activo`, `creado_en`, `actualizado_en`, `imagen_url`) VALUES
(1, 'Corona Zirconio', NULL, 1, '2026-03-09 16:48:09', '2026-03-12 23:16:08', '/uploads/servicios/1773357368843.jpg'),
(2, 'PPR Metálica', NULL, 1, '2026-03-09 16:48:09', '2026-03-09 16:48:09', NULL),
(3, 'Prótesis Total', NULL, 1, '2026-03-09 16:48:09', '2026-03-09 16:48:09', NULL),
(4, 'Corona Metal Cerámica', NULL, 1, '2026-03-09 16:48:09', '2026-03-09 16:48:09', NULL),
(5, 'Incrustación', NULL, 1, '2026-03-09 16:48:09', '2026-03-09 16:48:09', NULL),
(6, 'Puente Fijo', NULL, 1, '2026-03-09 16:48:09', '2026-03-09 16:48:09', NULL),
(7, 'kbrket', 500.00, 1, '2026-03-11 01:17:24', '2026-03-11 01:17:24', NULL),
(8, 'SADASF', 200.00, 1, '2026-03-11 18:34:01', '2026-03-11 18:34:01', NULL),
(9, 'JHUIY7', 200.00, 1, '2026-03-11 18:35:29', '2026-03-11 18:35:29', NULL),
(10, 'FDGFDFGH', 50.00, 1, '2026-03-11 18:36:05', '2026-03-11 18:36:05', NULL),
(11, 'YFYF', 67.00, 1, '2026-03-11 18:36:29', '2026-03-11 18:36:29', NULL),
(12, 'SYXTCG', 50.00, 1, '2026-03-11 18:53:41', '2026-03-11 18:53:41', NULL),
(13, 'savagva', 70.00, 1, '2026-03-11 18:55:28', '2026-03-11 18:55:28', NULL),
(14, 'POPRSKWA', NULL, 1, '2026-03-11 20:15:41', '2026-03-11 20:15:41', NULL),
(15, 'protessi total', 500.00, 0, '2026-03-12 02:21:49', '2026-03-23 21:08:10', NULL),
(16, 'perno', NULL, 1, '2026-03-12 03:04:13', '2026-03-12 03:04:13', NULL),
(17, 'Una total superior y inferior', NULL, 1, '2026-03-12 20:58:08', '2026-03-12 20:58:08', NULL),
(18, 'porcelana', NULL, 1, '2026-03-15 03:50:58', '2026-03-15 03:51:32', '/uploads/servicios/1773546658819.jpeg');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `nombre_usuario` varchar(50) NOT NULL,
  `contrasena_hash` varchar(255) NOT NULL,
  `nombre_completo` varchar(100) DEFAULT NULL,
  `rol` enum('admin','operador','supervisor') DEFAULT 'operador',
  `activo` tinyint(1) DEFAULT 1,
  `ultimo_acceso` datetime DEFAULT NULL,
  `creado_en` datetime NOT NULL,
  `actualizado_en` datetime NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `ultimo_ip` varchar(45) DEFAULT NULL,
  `intentos_fallidos` int(11) DEFAULT 0,
  `bloqueado_hasta` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `nombre_usuario`, `contrasena_hash`, `nombre_completo`, `rol`, `activo`, `ultimo_acceso`, `creado_en`, `actualizado_en`, `email`, `ultimo_ip`, `intentos_fallidos`, `bloqueado_hasta`) VALUES
(2, 'admin', '$2a$10$ZwU1YZZLN2SiV.bdaZh4TO1t5qJ6K0tb4zd/YGt/wDnS8HlQW7/9q', 'Administrador', 'admin', 1, '2026-03-24 18:35:47', '0000-00-00 00:00:00', '2026-03-24 18:35:47', NULL, '::1', 0, NULL);

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `vista_dashboard_metricas`
-- (Véase abajo para la vista actual)
--
CREATE TABLE `vista_dashboard_metricas` (
`ordenes_activas` bigint(21)
,`deuda_total` decimal(55,2)
,`caja_hoy` decimal(32,2)
,`deuda_pendiente` decimal(55,2)
,`ordenes_terminadas` bigint(21)
,`ordenes_vencidas` bigint(21)
,`caja_semana` decimal(32,2)
,`caja_mes` decimal(32,2)
);

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `vista_resumen_doctores`
-- (Véase abajo para la vista actual)
--
CREATE TABLE `vista_resumen_doctores` (
`id` int(11)
,`nombre` varchar(100)
,`telefono_whatsapp` varchar(20)
,`total_ordenes` bigint(21)
,`ordenes_pendientes` bigint(21)
,`total_facturado` decimal(32,2)
,`total_pagado` decimal(54,2)
,`deuda_total` decimal(55,2)
);

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `vista_ultima_actividad`
-- (Véase abajo para la vista actual)
--
CREATE TABLE `vista_ultima_actividad` (
`fecha` timestamp
,`usuario` varchar(50)
,`accion` varchar(50)
,`entidad_tipo` varchar(50)
,`detalle` longtext
);

-- --------------------------------------------------------

--
-- Estructura para la vista `vista_dashboard_metricas`
--
DROP TABLE IF EXISTS `vista_dashboard_metricas`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vista_dashboard_metricas`  AS WITH saldos_ordenes AS (SELECT `o`.`id` AS `id`, `o`.`estado` AS `estado`, `o`.`activo` AS `activo`, `o`.`fecha_limite` AS `fecha_limite`, `o`.`total` AS `total`, coalesce(sum(`p`.`monto`),0) AS `total_pagado`, `o`.`total`- coalesce(sum(`p`.`monto`),0) AS `saldo` FROM (`ordenes` `o` left join `pagos` `p` on(`p`.`orden_id` = `o`.`id`)) WHERE `o`.`activo` = 1 GROUP BY `o`.`id`, `o`.`estado`, `o`.`activo`, `o`.`fecha_limite`, `o`.`total`) SELECT (select count(0) from `ordenes` where `ordenes`.`activo` = 1 and `ordenes`.`estado` = 'pendiente') AS `ordenes_activas`, (select coalesce(sum(`saldos_ordenes`.`saldo`),0) from `saldos_ordenes` where `saldos_ordenes`.`estado` <> 'cancelado') AS `deuda_total`, (select coalesce(sum(`pagos`.`monto`),0) from `pagos` where cast(`pagos`.`creado_en` as date) = curdate()) AS `caja_hoy`, (select coalesce(sum(`saldos_ordenes`.`saldo`),0) from `saldos_ordenes` where `saldos_ordenes`.`estado` = 'pendiente') AS `deuda_pendiente`, (select count(0) from `ordenes` where `ordenes`.`estado` = 'terminado') AS `ordenes_terminadas`, (select count(0) from `saldos_ordenes` where `saldos_ordenes`.`estado` = 'pendiente' and `saldos_ordenes`.`fecha_limite` <= curdate() and `saldos_ordenes`.`saldo` > 0) AS `ordenes_vencidas`, (select coalesce(sum(`pagos`.`monto`),0) from `pagos` where yearweek(`pagos`.`creado_en`,1) = yearweek(curdate(),1)) AS `caja_semana`, (select coalesce(sum(`pagos`.`monto`),0) from `pagos` where month(`pagos`.`creado_en`) = month(curdate()) and year(`pagos`.`creado_en`) = year(curdate())) AS `caja_mes``caja_mes`  ;

-- --------------------------------------------------------

--
-- Estructura para la vista `vista_resumen_doctores`
--
DROP TABLE IF EXISTS `vista_resumen_doctores`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vista_resumen_doctores`  AS SELECT `d`.`id` AS `id`, `d`.`nombre` AS `nombre`, `d`.`telefono_whatsapp` AS `telefono_whatsapp`, count(distinct `o`.`id`) AS `total_ordenes`, count(distinct case when `o`.`estado` = 'pendiente' then `o`.`id` end) AS `ordenes_pendientes`, coalesce(sum(`o`.`total`),0) AS `total_facturado`, coalesce(sum(`p`.`total_pagado`),0) AS `total_pagado`, coalesce(sum(`o`.`total`) - coalesce(sum(`p`.`total_pagado`),0),0) AS `deuda_total` FROM ((`doctores` `d` left join `ordenes` `o` on(`d`.`id` = `o`.`doctor_id` and `o`.`activo` = 1)) left join (select `pagos`.`orden_id` AS `orden_id`,sum(`pagos`.`monto`) AS `total_pagado` from `pagos` group by `pagos`.`orden_id`) `p` on(`o`.`id` = `p`.`orden_id`)) WHERE `d`.`activo` = 1 GROUP BY `d`.`id`, `d`.`nombre`, `d`.`telefono_whatsapp` ;

-- --------------------------------------------------------

--
-- Estructura para la vista `vista_ultima_actividad`
--
DROP TABLE IF EXISTS `vista_ultima_actividad`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vista_ultima_actividad`  AS SELECT `la`.`creado_en` AS `fecha`, `u`.`nombre_usuario` AS `usuario`, `la`.`accion` AS `accion`, `la`.`entidad_tipo` AS `entidad_tipo`, `la`.`detalle` AS `detalle` FROM (`logs_actividad` `la` left join `usuarios` `u` on(`la`.`usuario_id` = `u`.`id`)) ORDER BY `la`.`creado_en` DESC LIMIT 0, 50 ;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `configuraciones`
--
ALTER TABLE `configuraciones`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `clave` (`clave`);

--
-- Indices de la tabla `doctores`
--
ALTER TABLE `doctores`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `logs_actividad`
--
ALTER TABLE `logs_actividad`
  ADD PRIMARY KEY (`id`),
  ADD KEY `usuario_id` (`usuario_id`),
  ADD KEY `idx_fecha` (`creado_en`),
  ADD KEY `idx_entidad` (`entidad_tipo`,`entidad_id`);

--
-- Indices de la tabla `ordenes`
--
ALTER TABLE `ordenes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_doctor` (`doctor_id`),
  ADD KEY `idx_estado` (`estado`),
  ADD KEY `idx_fechas` (`fecha_registro`,`fecha_limite`),
  ADD KEY `servicio_id` (`servicio_id`),
  ADD KEY `usuario_creo_id` (`usuario_creo_id`);

--
-- Indices de la tabla `pagos`
--
ALTER TABLE `pagos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_orden` (`orden_id`),
  ADD KEY `usuario_registro_id` (`usuario_registro_id`);

--
-- Indices de la tabla `servicios`
--
ALTER TABLE `servicios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nombre` (`nombre`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nombre_usuario` (`nombre_usuario`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `configuraciones`
--
ALTER TABLE `configuraciones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `doctores`
--
ALTER TABLE `doctores`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `logs_actividad`
--
ALTER TABLE `logs_actividad`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT de la tabla `ordenes`
--
ALTER TABLE `ordenes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT de la tabla `pagos`
--
ALTER TABLE `pagos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=45;

--
-- AUTO_INCREMENT de la tabla `servicios`
--
ALTER TABLE `servicios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `logs_actividad`
--
ALTER TABLE `logs_actividad`
  ADD CONSTRAINT `logs_actividad_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL;

--
-- Filtros para la tabla `ordenes`
--
ALTER TABLE `ordenes`
  ADD CONSTRAINT `ordenes_ibfk_90` FOREIGN KEY (`doctor_id`) REFERENCES `doctores` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `ordenes_ibfk_91` FOREIGN KEY (`servicio_id`) REFERENCES `servicios` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `ordenes_ibfk_92` FOREIGN KEY (`usuario_creo_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Filtros para la tabla `pagos`
--
ALTER TABLE `pagos`
  ADD CONSTRAINT `pagos_ibfk_61` FOREIGN KEY (`orden_id`) REFERENCES `ordenes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `pagos_ibfk_62` FOREIGN KEY (`usuario_registro_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
