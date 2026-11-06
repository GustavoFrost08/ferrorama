<?php
require "conexao.php";

$sql = "SELECT s.id, s.codigo, s.tipo, s.status, s.ultima_leitura, s.unidade,
               t.id AS trem_id, t.codigo AS trem
        FROM sensores s
        JOIN trens t ON s.trem_id = t.id
        ORDER BY t.id, s.codigo";

$resultado = $conn->query($sql);

if ($resultado === false) {
    echo json_encode(["erro" => $conn->error]);
    exit;
}

$sensores = [];

while ($sensor = $resultado->fetch_assoc()) {
    $sensores[] = $sensor;
}

echo json_encode($sensores);

$conn->close();
?>