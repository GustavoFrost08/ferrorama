<?php

header('Content-Type: application/json; charset=utf-8');

require_once 'conexao.php';

$sql = "SELECT
            id,
            titulo,
            descricao,
            gravidade,
            resolvido,
            criado_em
        FROM alertas
        ORDER BY criado_em DESC";

$resultado = $conn->query($sql);

$alertas = [];

while ($alerta = $resultado->fetch_assoc()) {
    $alertas[] = $alerta;
}

echo json_encode($alertas, JSON_UNESCAPED_UNICODE);

?>