<?php
// conexao.php
// Configuração padrão do XAMPP: usuário "root", sem senha, porta 3306

$host = "localhost";
$usuario = "root";
$senha = "";
$banco = "ferrorama";

$conn = new mysqli($host, $usuario, $senha, $banco);

if ($conn->connect_error) {
    http_response_code(500);
    die(json_encode(["erro" => "Falha na conexão: " . $conn->connect_error]));
}

$conn->set_charset("utf8mb4");