<?php
require "conexao.php";

$sql = "SELECT id, nome, sobrenome, email, perfil, status FROM usuarios ORDER BY id";

$resultado = $conn->query($sql);

if ($resultado === false) {
    echo json_encode(["erro" => $conn->error]);
    exit;
}

$usuarios = [];

while ($usuario = $resultado->fetch_assoc()) {
    $usuarios[] = $usuario;
}

echo json_encode($usuarios);

$conn->close();
?>