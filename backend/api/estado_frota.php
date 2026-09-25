<?php

header('Content-Type: application/json; charset=utf-8');

require_once 'conexao.php';

$sql = "SELECT 
            data_cadastro,
            numero_serie,
            status,
            linha,
            modelo
        FROM trens
        ORDER BY id ASC";

$resultado = $conn->query($sql);

$trens = [];

while ($row = $resultado->fetch_assoc()) {
    $trens[] = $row;
}

echo json_encode($trens);