<?php
mysqli_report(MYSQLI_REPORT_OFF);

header("Content-Type: application/json");

$host = "localhost";
$usuario = "root";
$senha = "";
$banco = "ferrorama";
$porta = "3308"; 

$conn = new mysqli($host, $usuario, $senha, $banco, $porta);

if ($conn->connect_error) {
    http_response_code(500);
    die(json_encode(["erro" => "Falha na conexão: " . $conn->connect_error]));
}

$conn->set_charset("utf8mb4");