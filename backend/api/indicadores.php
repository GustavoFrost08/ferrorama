<?php

header('Content-Type: application/json; charset=utf-8');

$host = "localhost";
$banco = "ferrorama";
$usuario = "root";
$senha = "";

try {

    $pdo = new PDO(
        "mysql:host=$host;dbname=$banco;charset=utf8mb4",
        $usuario,
        $senha
    );

    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $sql = "
        SELECT
            (
                SELECT ROUND(AVG(velocidade_atual))
                FROM trens
                WHERE status = 'em_operacao'
            ) AS velocidade_media,

            (
                SELECT COUNT(*)
                FROM alertas
                WHERE resolvido = 0
            ) AS alertas_ativos,

            (
                SELECT COUNT(*)
                FROM sensores
                WHERE status = 'critico'
            ) AS sensores_criticos
    ";

    $resultado = $pdo->query($sql)->fetch(PDO::FETCH_ASSOC);

    echo json_encode([
        "velocidade_media" => $resultado["velocidade_media"],
        "alertas_ativos" => $resultado["alertas_ativos"],
        "sensores_criticos" => $resultado["sensores_criticos"]
    ]);

} catch (PDOException $e) {

    http_response_code(500);

    echo json_encode([
        "erro" => "Erro ao conectar com o banco de dados"
    ]);
}