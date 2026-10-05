<?php
require "conexao.php";

$sql = "SELECT e.titulo,
               e.descricao,
               t.codigo,
               DATE_FORMAT(e.criado_em, '%d/%m/%Y às %H:%i') AS data_hora
        FROM eventos e
        LEFT JOIN trens t ON e.trem_id = t.id
        ORDER BY e.criado_em DESC";

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