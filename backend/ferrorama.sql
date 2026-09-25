CREATE DATABASE IF NOT EXISTS ferrorama
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_general_ci;

USE ferrorama;

CREATE TABLE IF NOT EXISTS usuarios (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  nome            VARCHAR(50)  NOT NULL,
  sobrenome       VARCHAR(50)  NOT NULL,
  email           VARCHAR(100) UNIQUE,         
  telefone        VARCHAR(20)  UNIQUE,        
  senha           VARCHAR(255) NOT NULL,       
  data_nascimento DATE,
  perfil          ENUM('admin','operador','comum') NOT NULL DEFAULT 'comum',
  status          ENUM('ativo','inativo')          NOT NULL DEFAULT 'ativo',
  criado_em       DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS trens (
  id                INT AUTO_INCREMENT PRIMARY KEY,
  codigo            VARCHAR(20) NOT NULL UNIQUE,  
  numero_serie      VARCHAR(20),                  
  modelo            VARCHAR(50),                  
  linha             VARCHAR(60),                 
  localizacao_atual VARCHAR(100),                
  velocidade_atual  INT NOT NULL DEFAULT 0,       
  status            ENUM('em_operacao','em_manutencao','parado',
                         'alerta_tecnico','inspecao','fora_de_uso')
                    NOT NULL DEFAULT 'parado',
  data_cadastro     DATE,
  atualizado_em     DATETIME DEFAULT CURRENT_TIMESTAMP
                    ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sensores (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  codigo         VARCHAR(10) NOT NULL UNIQUE,     
  tipo           ENUM('temperatura','vibracao','velocidade','pressao') NOT NULL,
  trem_id        INT NOT NULL,
  unidade        VARCHAR(10),                    
  limite_min     DECIMAL(8,2),                     
  limite_max     DECIMAL(8,2),                    
  ultima_leitura DECIMAL(8,2),
  status         ENUM('normal','alerta','critico') NOT NULL DEFAULT 'normal',
  atualizado_em  DATETIME DEFAULT CURRENT_TIMESTAMP
                 ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (trem_id) REFERENCES trens(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS leituras (
  id        INT AUTO_INCREMENT PRIMARY KEY,
  sensor_id INT NOT NULL,
  valor     DECIMAL(8,2) NOT NULL,
  lida_em   DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (sensor_id) REFERENCES sensores(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS alertas (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  trem_id    INT NOT NULL,
  sensor_id  INT NULL,                         
  titulo     VARCHAR(100) NOT NULL,
  descricao  VARCHAR(255),
  gravidade  ENUM('alerta','critico') NOT NULL,
  resolvido  TINYINT(1) NOT NULL DEFAULT 0,      
  criado_em  DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (trem_id)   REFERENCES trens(id)    ON DELETE CASCADE,
  FOREIGN KEY (sensor_id) REFERENCES sensores(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS eventos (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  trem_id    INT NULL, 
  titulo     VARCHAR(100) NOT NULL,
  descricao  VARCHAR(255),
  criado_em  DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (trem_id) REFERENCES trens(id) ON DELETE SET NULL
);

INSERT INTO usuarios (nome, sobrenome, email, senha, perfil, status) VALUES
('Carlos',   'Mendes', 'carlos@trainferro.com',   'SENHA_DE_EXEMPLO', 'admin',    'ativo'),
('Ana',      'Souza',  'ana@trainferro.com',      'SENHA_DE_EXEMPLO', 'operador', 'ativo'),
('Lucas',    'Lima',   'lucas@trainferro.com',    'SENHA_DE_EXEMPLO', 'comum',    'inativo'),
('Fernanda', 'Alves',  'fernanda@trainferro.com', 'SENHA_DE_EXEMPLO', 'operador', 'ativo'),
('Rafael',   'Costa',  'rafael@trainferro.com',   'SENHA_DE_EXEMPLO', 'admin',    'ativo'),
('Mariana',  'Lima',   'mariana@trainferro.com',  'SENHA_DE_EXEMPLO', 'comum',    'inativo');

INSERT INTO trens (codigo, numero_serie, modelo, linha, localizacao_atual, velocidade_atual, status, data_cadastro) VALUES
('TR-001', '900701-0', 'GE BB-36', 'Linha Norte',       'Estação Central',    82,  'em_operacao',   '2026-05-01'),
('TR-002', '900702-8', 'GE BB-36', 'Linha Sul',         'Pátio Sul',          0,   'em_manutencao', '2026-05-01'),
('TR-003', '900703-2', 'GE BB-36', 'Linha Oeste',       'Próx. Estação Vila Nova', 67, 'em_operacao', '2026-05-01'),
('TR-004', '900704-9', 'GE BB-36', 'Linha Leste',       'Km 45',              40,  'alerta_tecnico','2026-05-01'),
('TR-005', '900705-4', 'GE BB-36', 'Linha Norte',       'Estação Terminal Sul', 0, 'parado',        '2026-05-01'),
('TR-006', '900706-7', 'GE BB-36', 'Linha Expresso',    'Km 102',             110, 'em_operacao',   '2026-05-01'),
('TR-007', '900707-3', 'GE BB-36', 'Linha Norte',       'Oficina Central',    0,   'inspecao',      '2026-05-01'),
('TR-008', '900708-7', 'GE BB-36', 'Linha Metropolitana','Estação Jardim Azul', 89, 'em_operacao',  '2026-05-01');

INSERT INTO trens (codigo, numero_serie, modelo, linha, localizacao_atual, velocidade_atual, status, data_cadastro) VALUES
('TR-009', '900709-5', 'GE BB-36', 'Linha Norte', 'Km 78', 74, 'em_operacao', '2026-05-01'),
('TR-010', '900710-1', 'GE BB-36', 'Linha Sul', 'Km 32', 65, 'em_operacao', '2026-05-01'),
('TR-011', '900711-9', 'GE BB-36', 'Linha Oeste', 'Km 51', 80, 'em_operacao', '2026-05-01'),
('TR-012', '900712-6', 'GE BB-36', 'Linha Leste', 'Km 12', 72, 'em_operacao', '2026-05-01'),
('TR-013', '900713-4', 'GE BB-36', 'Linha Norte', 'Km 90', 91, 'em_operacao', '2026-05-01'),
('TR-014', '900714-2', 'GE BB-36', 'Linha Sul', 'Km 44', 68, 'em_operacao', '2026-05-01'),
('TR-015', '900715-8', 'GE BB-36', 'Linha Oeste', 'Km 23', 77, 'em_operacao', '2026-05-01'),
('TR-016', '900716-5', 'GE BB-36', 'Linha Expresso', 'Km 102', 110, 'em_operacao', '2026-05-01'),
('TR-017', '900717-3', 'GE BB-36', 'Linha Metropolitana', 'Km 18', 83, 'em_operacao', '2026-05-01'),
('TR-018', '900718-0', 'GE BB-36', 'Linha Sul', 'Oficina Sul', 0, 'em_manutencao', '2026-05-01'),
('TR-019', '900719-7', 'GE BB-36', 'Linha Norte', 'Oficina Norte', 0, 'em_manutencao', '2026-05-01');

INSERT INTO sensores (codigo, tipo, trem_id, unidade, limite_min, limite_max, ultima_leitura, status) VALUES
('S001', 'temperatura', 1, '°C',   20, 80, 72, 'normal'),
('S002', 'vibracao',    3, 'mm/s', 0, 10, 15, 'alerta'),
('S003', 'velocidade',  5, 'km/h', 0, 120, 88, 'normal'),
('S102', 'vibracao',    4, 'mm/s', 0, 10, 18, 'critico'),
('S004', 'temperatura', 2, '°C', 20, 80, 65, 'normal'),
('S005', 'temperatura', 3, '°C', 20, 80, 70, 'normal'),
('S006', 'temperatura', 4, '°C', 20, 80, 82, 'alerta'),
('S007', 'temperatura', 5, '°C', 20, 80, 68, 'normal'),
('S008', 'temperatura', 6, '°C', 20, 80, 71, 'normal'),
('S009', 'temperatura', 7, '°C', 20, 80, 75, 'normal'),
('S010', 'temperatura', 8, '°C', 20, 80, 69, 'normal'),
('S011', 'temperatura', 9, '°C', 20, 80, 73, 'normal'),
('S012', 'temperatura', 10, '°C', 20, 80, 76, 'normal'),
('S013', 'temperatura', 11, '°C', 20, 80, 72, 'normal'),
('S014', 'temperatura', 12, '°C', 20, 80, 74, 'normal'),
('S015', 'temperatura', 13, '°C', 20, 80, 70, 'normal'),
('S016', 'temperatura', 14, '°C', 20, 80, 77, 'normal'),
('S017', 'temperatura', 15, '°C', 20, 80, 71, 'normal'),
('S018', 'temperatura', 16, '°C', 20, 80, 73, 'normal'),
('S019', 'temperatura', 17, '°C', 20, 80, 79, 'normal'),
('S020', 'temperatura', 18, '°C', 20, 80, 81, 'alerta'),
('S021', 'temperatura', 19, '°C', 20, 80, 70, 'normal');

INSERT INTO leituras (sensor_id, valor, lida_em) VALUES
(1, 70, '2026-05-01 10:00:00'),
(1, 74, '2026-05-02 10:00:00'),
(1, 78, '2026-05-03 10:00:00'),
(1, 75, '2026-05-04 10:00:00'),
(1, 72, '2026-05-05 10:00:00'),

(2, 4,  '2026-05-01 10:00:00'),
(2, 6,  '2026-05-02 10:00:00'),
(2, 8,  '2026-05-03 10:00:00'),
(2, 7,  '2026-05-04 10:00:00'),
(2, 9,  '2026-05-05 10:00:00'),
(2, 15, '2026-05-06 10:00:00'),

(3, 60, '2026-05-01 10:00:00'),
(3, 65, '2026-05-02 10:00:00'),
(3, 72, '2026-05-03 10:00:00'),
(3, 60, '2026-05-04 10:00:00'),
(3, 75, '2026-05-05 10:00:00'),
(3, 88, '2026-05-06 10:00:00'),

(4, 8,  '2026-05-01 10:00:00'),
(4, 9,  '2026-05-02 10:00:00'),
(4, 12, '2026-05-03 10:00:00'),
(4, 14, '2026-05-04 10:00:00'),
(4, 16, '2026-05-05 10:00:00'),
(4, 18, '2026-05-06 10:00:00');

INSERT INTO alertas (trem_id, sensor_id, titulo, descricao, gravidade, resolvido) VALUES
(4, 4, 'Trem 04 - Vibração crítica', 'Vibração acima do limite permitido', 'critico', 0),
(3, 2, 'Trem 03 - Vibração elevada', 'Vibração próxima do limite permitido', 'alerta', 0),
(5, 3, 'Trem 05 - Velocidade irregular', 'Velocidade fora do padrão esperado', 'alerta', 0),
(6, NULL, 'Trem 06 - Velocidade elevada', 'Velocidade acima do limite operacional', 'critico', 0),
(7, NULL, 'Trem 07 - Inspeção necessária', 'Trem aguardando inspeção preventiva', 'alerta', 0),
(8, NULL, 'Trem 08 - Temperatura elevada', 'Temperatura acima do nível recomendado', 'critico', 0),
(9, NULL, 'Trem 09 - Trem parado', 'Trem encontra-se fora de operação', 'alerta', 0),
(10, NULL, 'Trem 10 - Alerta operacional', 'Foi identificado um alerta operacional', 'alerta', 0);


INSERT INTO eventos (trem_id, titulo, descricao, criado_em) VALUES
(1, 'Trem 01 - Partida realizada', 'Partida de Estação Norte com destino a Terminal Leste', '2026-05-01 10:24:00'),
(2, 'Manutenção programada - trem 02', 'Iniciada a manutenção preventiva', '2026-05-03 10:24:00'),
(1, 'Passagem pela Estação Central', 'Registro automático de localização', '2026-05-05 10:45:00'),
(1, 'Trem em operação normal', 'Velocidade dentro dos parâmetros', '2026-05-06 10:24:00'),
(3, 'Todos os sensores operando', 'Velocidade dentro dos parâmetros', '2026-05-07 10:03:00'),
(4, 'Vibração acima do normal', 'Sensor S102 detectou vibração elevada', '2026-05-08 10:24:00'),
(1, 'Início da rota', 'Partida de Estação Norte', '2026-05-09 10:24:00');