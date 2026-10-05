<?php
require "conexao.php";

$resultado = $conn->query("SELECT * FROM trens ORDER BY id");

if ($resultado === false) {
    echo json_encode(["erro" => $conn->error]);
    exit;
}

$trens = [];

while ($trem = $resultado->fetch_assoc()) {
    $trens[] = $trem;
}

echo json_encode($trens);

$conn->close();
?>