<?php

header('Content-Type: application/json; charset=utf-8');

require_once 'conexao.php';

$sql = "SELECT 
            id,
            titulo,
            descricao,
            criado_em
        FROM alertas
        WHERE gravidade = 'critico'
        AND resolvido = 0
        ORDER BY criado_em DESC
        LIMIT 5";

$resultado = $conn->query($sql);

$alertas = [];

while ($alerta = $resultado->fetch_assoc()) {
    $alertas[] = $alerta;
}

echo json_encode($alertas, JSON_UNESCAPED_UNICODE);
?>