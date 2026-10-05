<?php
require "conexao.php";

// pega os 5 eventos mais recentes
$sql = "SELECT titulo, descricao, DATE_FORMAT(criado_em, '%H:%i') AS hora
        FROM eventos
        ORDER BY criado_em DESC
        LIMIT 5";

$resultado = $conn->query($sql);

if ($resultado === false) {
    echo json_encode(["erro" => $conn->error]);
    exit;
}

$eventos = [];

while ($evento = $resultado->fetch_assoc()) {
    $eventos[] = $evento;
}

echo json_encode($eventos);

$conn->close();
?>