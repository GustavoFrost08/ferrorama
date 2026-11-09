-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Tempo de geração: 09/11/2026 às 15:05
-- Versão do servidor: 10.4.32-MariaDB
-- Versão do PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `ferrorama`
--

-- --------------------------------------------------------

--
-- Estrutura para tabela `alertas`
--

CREATE TABLE `alertas` (
  `id` int(11) NOT NULL,
  `trem_id` int(11) NOT NULL,
  `sensor_id` int(11) DEFAULT NULL,
  `titulo` varchar(100) NOT NULL,
  `descricao` varchar(255) DEFAULT NULL,
  `gravidade` enum('alerta','critico') NOT NULL,
  `resolvido` tinyint(1) NOT NULL DEFAULT 0,
  `criado_em` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `alertas`
--

INSERT INTO `alertas` (`id`, `trem_id`, `sensor_id`, `titulo`, `descricao`, `gravidade`, `resolvido`, `criado_em`) VALUES
(1, 4, 4, 'Trem 04 - Vibração crítica', 'Vibração acima do limite permitido', 'critico', 0, '2026-09-22 11:47:46'),
(2, 3, 2, 'Trem 03 - Vibração elevada', 'Vibração próxima do limite permitido', 'alerta', 0, '2026-09-22 11:47:46'),
(3, 5, 3, 'Trem 05 - Velocidade irregular', 'Velocidade fora do padrão esperado', 'alerta', 0, '2026-09-22 11:47:46'),
(4, 6, NULL, 'Trem 06 - Velocidade elevada', 'Velocidade acima do limite operacional', 'critico', 0, '2026-09-22 11:47:46'),
(5, 7, NULL, 'Trem 07 - Inspeção necessária', 'Trem aguardando inspeção preventiva', 'alerta', 0, '2026-09-22 11:47:46'),
(6, 8, NULL, 'Trem 08 - Temperatura elevada', 'Temperatura acima do nível recomendado', 'critico', 0, '2026-09-22 11:47:46'),
(7, 9, NULL, 'Trem 09 - Trem parado', 'Trem encontra-se fora de operação', 'alerta', 0, '2026-09-22 11:47:46'),
(8, 10, NULL, 'Trem 10 - Alerta operacional', 'Foi identificado um alerta operacional', 'alerta', 0, '2026-09-22 11:47:46');

-- --------------------------------------------------------

--
-- Estrutura para tabela `eventos`
--

CREATE TABLE `eventos` (
  `id` int(11) NOT NULL,
  `trem_id` int(11) DEFAULT NULL,
  `titulo` varchar(100) NOT NULL,
  `descricao` varchar(255) DEFAULT NULL,
  `criado_em` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `eventos`
--

INSERT INTO `eventos` (`id`, `trem_id`, `titulo`, `descricao`, `criado_em`) VALUES
(1, 1, 'Trem 01 - Partida realizada', 'Partida de Estação Norte com destino a Terminal Leste', '2026-05-01 10:24:00'),
(2, 2, 'Manutenção programada - trem 02', 'Iniciada a manutenção preventiva', '2026-05-03 10:24:00'),
(3, 1, 'Passagem pela Estação Central', 'Registro automático de localização', '2026-05-05 10:45:00'),
(4, 1, 'Trem em operação normal', 'Velocidade dentro dos parâmetros', '2026-05-06 10:24:00'),
(5, 3, 'Todos os sensores operando', 'Velocidade dentro dos parâmetros', '2026-05-07 10:03:00'),
(6, 4, 'Vibração acima do normal', 'Sensor S102 detectou vibração elevada', '2026-05-08 10:24:00'),
(7, 1, 'Início da rota', 'Partida de Estação Norte', '2026-05-09 10:24:00'),
(8, 21, 'TR-021 - Trem cadastrado', 'Linha Sul - vila nova', '2026-10-05 08:48:28'),
(9, 22, 'TR-022 - Trem cadastrado', 'Linha Norte - albino', '2026-10-05 08:51:05'),
(10, 23, 'TR-023 - Trem cadastrado', 'Linha Sul - moinho', '2026-11-06 09:44:41');

-- --------------------------------------------------------

--
-- Estrutura para tabela `leituras`
--

CREATE TABLE `leituras` (
  `id` int(11) NOT NULL,
  `sensor_id` int(11) NOT NULL,
  `valor` decimal(8,2) NOT NULL,
  `lida_em` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `leituras`
--

INSERT INTO `leituras` (`id`, `sensor_id`, `valor`, `lida_em`) VALUES
(1, 1, 70.00, '2026-05-01 10:00:00'),
(2, 1, 74.00, '2026-05-02 10:00:00'),
(3, 1, 78.00, '2026-05-03 10:00:00'),
(4, 1, 75.00, '2026-05-04 10:00:00'),
(5, 1, 72.00, '2026-05-05 10:00:00'),
(6, 2, 4.00, '2026-05-01 10:00:00'),
(7, 2, 6.00, '2026-05-02 10:00:00'),
(8, 2, 8.00, '2026-05-03 10:00:00'),
(9, 2, 7.00, '2026-05-04 10:00:00'),
(10, 2, 9.00, '2026-05-05 10:00:00'),
(11, 2, 15.00, '2026-05-06 10:00:00'),
(12, 3, 60.00, '2026-05-01 10:00:00'),
(13, 3, 65.00, '2026-05-02 10:00:00'),
(14, 3, 72.00, '2026-05-03 10:00:00'),
(15, 3, 60.00, '2026-05-04 10:00:00'),
(16, 3, 75.00, '2026-05-05 10:00:00'),
(17, 3, 88.00, '2026-05-06 10:00:00'),
(18, 4, 8.00, '2026-05-01 10:00:00'),
(19, 4, 9.00, '2026-05-02 10:00:00'),
(20, 4, 12.00, '2026-05-03 10:00:00'),
(21, 4, 14.00, '2026-05-04 10:00:00'),
(22, 4, 16.00, '2026-05-05 10:00:00'),
(23, 4, 18.00, '2026-05-06 10:00:00'),
(24, 23, -0.43, '2026-11-09 08:41:28');

-- --------------------------------------------------------

--
-- Estrutura para tabela `sensores`
--

CREATE TABLE `sensores` (
  `id` int(11) NOT NULL,
  `codigo` varchar(10) NOT NULL,
  `tipo` enum('temperatura','vibracao','velocidade','pressao') NOT NULL,
  `trem_id` int(11) NOT NULL,
  `unidade` varchar(10) DEFAULT NULL,
  `limite_min` decimal(8,2) DEFAULT NULL,
  `limite_max` decimal(8,2) DEFAULT NULL,
  `ultima_leitura` decimal(8,2) DEFAULT NULL,
  `status` enum('normal','alerta','critico') NOT NULL DEFAULT 'normal',
  `atualizado_em` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `sensores`
--

INSERT INTO `sensores` (`id`, `codigo`, `tipo`, `trem_id`, `unidade`, `limite_min`, `limite_max`, `ultima_leitura`, `status`, `atualizado_em`) VALUES
(1, 'S001', 'temperatura', 1, '°C', 20.00, 80.00, 72.00, 'normal', '2026-09-22 11:47:46'),
(2, 'S002', 'vibracao', 3, 'mm/s', 0.00, 10.00, 15.00, 'alerta', '2026-09-22 11:47:46'),
(3, 'S003', 'velocidade', 5, 'km/h', 0.00, 120.00, 88.00, 'normal', '2026-09-22 11:47:46'),
(4, 'S102', 'vibracao', 4, 'mm/s', 0.00, 10.00, 18.00, 'critico', '2026-09-22 11:47:46'),
(5, 'S004', 'temperatura', 2, '°C', 20.00, 80.00, 65.00, 'normal', '2026-09-22 11:47:46'),
(6, 'S005', 'temperatura', 3, '°C', 20.00, 80.00, 70.00, 'normal', '2026-09-22 11:47:46'),
(7, 'S006', 'temperatura', 4, '°C', 20.00, 80.00, 82.00, 'alerta', '2026-09-22 11:47:46'),
(8, 'S007', 'temperatura', 5, '°C', 20.00, 80.00, 68.00, 'normal', '2026-09-22 11:47:46'),
(9, 'S008', 'temperatura', 6, '°C', 20.00, 80.00, 71.00, 'normal', '2026-09-22 11:47:46'),
(10, 'S009', 'temperatura', 7, '°C', 20.00, 80.00, 75.00, 'normal', '2026-09-22 11:47:46'),
(11, 'S010', 'temperatura', 8, '°C', 20.00, 80.00, 69.00, 'normal', '2026-09-22 11:47:46'),
(12, 'S011', 'temperatura', 9, '°C', 20.00, 80.00, 73.00, 'normal', '2026-09-22 11:47:46'),
(13, 'S012', 'temperatura', 10, '°C', 20.00, 80.00, 76.00, 'normal', '2026-09-22 11:47:46'),
(14, 'S013', 'temperatura', 11, '°C', 20.00, 80.00, 72.00, 'normal', '2026-09-22 11:47:46'),
(15, 'S014', 'temperatura', 12, '°C', 20.00, 80.00, 74.00, 'normal', '2026-09-22 11:47:46'),
(16, 'S015', 'temperatura', 13, '°C', 20.00, 80.00, 70.00, 'normal', '2026-09-22 11:47:46'),
(17, 'S016', 'temperatura', 14, '°C', 20.00, 80.00, 77.00, 'normal', '2026-09-22 11:47:46'),
(18, 'S017', 'temperatura', 15, '°C', 20.00, 80.00, 71.00, 'normal', '2026-09-22 11:47:46'),
(19, 'S018', 'temperatura', 16, '°C', 20.00, 80.00, 73.00, 'normal', '2026-09-22 11:47:46'),
(20, 'S019', 'temperatura', 17, '°C', 20.00, 80.00, 79.00, 'normal', '2026-09-22 11:47:46'),
(21, 'S020', 'temperatura', 18, '°C', 20.00, 80.00, 81.00, 'alerta', '2026-09-22 11:47:46'),
(22, 'S021', 'temperatura', 19, '°C', 20.00, 80.00, 70.00, 'normal', '2026-09-22 11:47:46'),
(23, '40028922', 'temperatura', 20, '°C', 10.00, 100.00, -0.43, 'alerta', '2026-11-09 08:41:28');

-- --------------------------------------------------------

--
-- Estrutura para tabela `trens`
--

CREATE TABLE `trens` (
  `id` int(11) NOT NULL,
  `codigo` varchar(20) NOT NULL,
  `numero_serie` varchar(20) DEFAULT NULL,
  `modelo` varchar(50) DEFAULT NULL,
  `linha` varchar(60) DEFAULT NULL,
  `localizacao_atual` varchar(100) DEFAULT NULL,
  `velocidade_atual` int(11) NOT NULL DEFAULT 0,
  `status` enum('em_operacao','em_manutencao','parado','alerta_tecnico','inspecao','fora_de_uso') NOT NULL DEFAULT 'parado',
  `data_cadastro` date DEFAULT NULL,
  `atualizado_em` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `trens`
--

INSERT INTO `trens` (`id`, `codigo`, `numero_serie`, `modelo`, `linha`, `localizacao_atual`, `velocidade_atual`, `status`, `data_cadastro`, `atualizado_em`) VALUES
(1, 'TR-001', '900701-0', 'GE BB-36', 'Linha Norte', 'Estação Central', 82, 'em_operacao', '2026-05-01', '2026-09-22 11:47:46'),
(2, 'TR-002', '900702-8', 'GE BB-36', 'Linha Sul', 'Pátio Sul', 0, 'em_manutencao', '2026-05-01', '2026-09-22 11:47:46'),
(3, 'TR-003', '900703-2', 'GE BB-36', 'Linha Oeste', 'Próx. Estação Vila Nova', 67, 'em_operacao', '2026-05-01', '2026-09-22 11:47:46'),
(4, 'TR-004', '900704-9', 'GE BB-36', 'Linha Leste', 'Km 45', 40, 'alerta_tecnico', '2026-05-01', '2026-09-22 11:47:46'),
(5, 'TR-005', '900705-4', 'GE BB-36', 'Linha Norte', 'Estação Terminal Sul', 0, 'parado', '2026-05-01', '2026-09-22 11:47:46'),
(6, 'TR-006', '900706-7', 'GE BB-36', 'Linha Expresso', 'Km 102', 110, 'em_operacao', '2026-05-01', '2026-09-22 11:47:46'),
(7, 'TR-007', '900707-3', 'GE BB-36', 'Linha Norte', 'Oficina Central', 0, 'inspecao', '2026-05-01', '2026-09-22 11:47:46'),
(8, 'TR-008', '900708-7', 'GE BB-36', 'Linha Metropolitana', 'Estação Jardim Azul', 89, 'em_operacao', '2026-05-01', '2026-09-22 11:47:46'),
(9, 'TR-009', '900709-5', 'GE BB-36', 'Linha Norte', 'Km 78', 74, 'em_operacao', '2026-05-01', '2026-09-22 11:47:46'),
(10, 'TR-010', '900710-1', 'GE BB-36', 'Linha Sul', 'Km 32', 65, 'em_operacao', '2026-05-01', '2026-09-22 11:47:46'),
(11, 'TR-011', '900711-9', 'GE BB-36', 'Linha Oeste', 'Km 51', 80, 'em_operacao', '2026-05-01', '2026-09-22 11:47:46'),
(12, 'TR-012', '900712-6', 'GE BB-36', 'Linha Leste', 'Km 12', 72, 'em_operacao', '2026-05-01', '2026-09-22 11:47:46'),
(13, 'TR-013', '900713-4', 'GE BB-36', 'Linha Norte', 'Km 90', 91, 'em_operacao', '2026-05-01', '2026-09-22 11:47:46'),
(14, 'TR-014', '900714-2', 'GE BB-36', 'Linha Sul', 'Km 44', 68, 'em_operacao', '2026-05-01', '2026-09-22 11:47:46'),
(15, 'TR-015', '900715-8', 'GE BB-36', 'Linha Oeste', 'Km 23', 77, 'em_operacao', '2026-05-01', '2026-09-22 11:47:46'),
(16, 'TR-016', '900716-5', 'GE BB-36', 'Linha Expresso', 'Km 102', 110, 'em_operacao', '2026-05-01', '2026-09-22 11:47:46'),
(17, 'TR-017', '900717-3', 'GE BB-36', 'Linha Metropolitana', 'Km 18', 83, 'em_operacao', '2026-05-01', '2026-09-22 11:47:46'),
(18, 'TR-018', '900718-0', 'GE BB-36', 'Linha Sul', 'Oficina Sul', 0, 'em_manutencao', '2026-05-01', '2026-09-22 11:47:46'),
(19, 'TR-019', '900719-7', 'GE BB-36', 'Linha Norte', 'Oficina Norte', 0, 'em_manutencao', '2026-05-01', '2026-09-22 11:47:46'),
(20, 'TR-020', '3', 'trem_top', 'Linha Sul', 'guanabara', 107, 'em_operacao', '2008-03-03', '2026-10-05 08:36:14'),
(21, 'TR-021', '5', 'junior', 'Linha Sul', 'vila nova', 111, 'em_operacao', '4444-04-04', '2026-10-05 08:48:28'),
(22, 'TR-022', '8', 'topzeera', 'Linha Norte', 'albino', 200, 'em_operacao', '2026-06-15', '2026-10-05 08:51:05'),
(23, 'TR-023', '8', 'mto zika', 'Linha Sul', 'moinho', 122, 'parado', '2008-06-05', '2026-11-06 09:44:41');

-- --------------------------------------------------------

--
-- Estrutura para tabela `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `nome` varchar(50) NOT NULL,
  `sobrenome` varchar(50) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `telefone` varchar(20) DEFAULT NULL,
  `senha` varchar(255) NOT NULL,
  `data_nascimento` date DEFAULT NULL,
  `perfil` enum('admin','operador','comum') NOT NULL DEFAULT 'comum',
  `status` enum('ativo','inativo') NOT NULL DEFAULT 'ativo',
  `criado_em` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `usuarios`
--

INSERT INTO `usuarios` (`id`, `nome`, `sobrenome`, `email`, `telefone`, `senha`, `data_nascimento`, `perfil`, `status`, `criado_em`) VALUES
(1, 'Carlos', 'Mendes', 'carlos@trainferro.com', NULL, 'SENHA_DE_EXEMPLO', NULL, 'admin', 'ativo', '2026-09-22 11:47:46'),
(2, 'Ana', 'Souza', 'ana@trainferro.com', NULL, 'SENHA_DE_EXEMPLO', NULL, 'operador', 'ativo', '2026-09-22 11:47:46'),
(3, 'Lucas', 'Lima', 'lucas@trainferro.com', NULL, 'SENHA_DE_EXEMPLO', NULL, 'comum', 'inativo', '2026-09-22 11:47:46'),
(4, 'Fernanda', 'Alves', 'fernanda@trainferro.com', NULL, 'SENHA_DE_EXEMPLO', NULL, 'operador', 'ativo', '2026-09-22 11:47:46'),
(5, 'Rafael', 'Costa', 'rafael@trainferro.com', NULL, 'SENHA_DE_EXEMPLO', NULL, 'admin', 'ativo', '2026-09-22 11:47:46'),
(6, 'Mariana', 'Lima', 'mariana@trainferro.com', NULL, 'SENHA_DE_EXEMPLO', NULL, 'comum', 'inativo', '2026-09-22 11:47:46'),
(23, 'gustavo', 'frost', 'gustavo@gmail.com', NULL, '$2y$10$472CzIbRpdUeKyvED.Sr8urijBDl5XyO7YORuQkpuJW/CQY6OJeF6', '2010-02-17', 'comum', 'ativo', '2026-09-25 09:52:51'),
(24, 'teste', 'teste', 'teste@teste.com', NULL, '$2y$10$kk6O20oPrz4xFgl87cTa3.jxoE7O.Ct5QOZ5gSuN6/9zm.mo.Vzcy', '2012-03-14', 'comum', 'ativo', '2026-09-25 09:59:21'),
(25, 'giovanna', 'bento', 'giovannabento@xn--emailfodo-s2a.com', NULL, '$2y$10$FZiAPMbCeotenFprs3aL/eassqgtserDfGiH4T0qtsMq0WR4VTYyG', NULL, 'admin', 'inativo', '2026-11-03 11:16:16'),
(26, 'Gustavoxis', 'Frost', 'gustavo_frost@estudante.sesisenai.org.br', '42228922', '$2y$10$hxfoE.J8P7W06iBytzZ3u.mP/G4VE1lvhrbhGWh8MvWobvDW4o4da', '2010-04-13', 'comum', 'ativo', '2026-11-03 11:29:07'),
(27, 'gustavoxxxx', 'aaa', 'aa@gmail.com', NULL, '$2y$10$sHvYPGiGjbV5hKY0v7iJuu1AFA5ohHATz0ltF71X0tsglEwIa8Jpa', NULL, 'admin', 'inativo', '2026-11-06 09:49:57'),
(28, 'chupa', 'bala', 'chupa_bala@gmail.com', NULL, '$2y$10$zQ9asqJ9QQl2uUqTjr1tnukC5VtrcNrpmyYpUjPwDvkbET9qg8OXm', '2011-05-06', 'comum', 'ativo', '2026-11-06 11:59:24'),
(29, 'chupa', 'mto', 'chupa@gmail.com', NULL, '$2y$10$4bmRkkRW.ngEcGkT1RYsXuN6Ao22JBLSQd6C5iOp/v3XntEahN0jK', NULL, 'operador', 'inativo', '2026-11-06 12:01:47');

--
-- Índices para tabelas despejadas
--

--
-- Índices de tabela `alertas`
--
ALTER TABLE `alertas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `trem_id` (`trem_id`),
  ADD KEY `sensor_id` (`sensor_id`);

--
-- Índices de tabela `eventos`
--
ALTER TABLE `eventos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `trem_id` (`trem_id`);

--
-- Índices de tabela `leituras`
--
ALTER TABLE `leituras`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sensor_id` (`sensor_id`);

--
-- Índices de tabela `sensores`
--
ALTER TABLE `sensores`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `codigo` (`codigo`),
  ADD KEY `trem_id` (`trem_id`);

--
-- Índices de tabela `trens`
--
ALTER TABLE `trens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `codigo` (`codigo`);

--
-- Índices de tabela `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `telefone` (`telefone`);

--
-- AUTO_INCREMENT para tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `alertas`
--
ALTER TABLE `alertas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de tabela `eventos`
--
ALTER TABLE `eventos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de tabela `leituras`
--
ALTER TABLE `leituras`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT de tabela `sensores`
--
ALTER TABLE `sensores`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT de tabela `trens`
--
ALTER TABLE `trens`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT de tabela `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- Restrições para tabelas despejadas
--

--
-- Restrições para tabelas `alertas`
--
ALTER TABLE `alertas`
  ADD CONSTRAINT `alertas_ibfk_1` FOREIGN KEY (`trem_id`) REFERENCES `trens` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `alertas_ibfk_2` FOREIGN KEY (`sensor_id`) REFERENCES `sensores` (`id`) ON DELETE SET NULL;

--
-- Restrições para tabelas `eventos`
--
ALTER TABLE `eventos`
  ADD CONSTRAINT `eventos_ibfk_1` FOREIGN KEY (`trem_id`) REFERENCES `trens` (`id`) ON DELETE SET NULL;

--
-- Restrições para tabelas `leituras`
--
ALTER TABLE `leituras`
  ADD CONSTRAINT `leituras_ibfk_1` FOREIGN KEY (`sensor_id`) REFERENCES `sensores` (`id`) ON DELETE CASCADE;

--
-- Restrições para tabelas `sensores`
--
ALTER TABLE `sensores`
  ADD CONSTRAINT `sensores_ibfk_1` FOREIGN KEY (`trem_id`) REFERENCES `trens` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
