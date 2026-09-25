<?php

$conn = new mysqli("localhost", "root", "", "ferrorama");

if ($conn->connect_error) {
    die("Erro na conexão");
}

$sql = "SELECT * FROM trens ORDER BY id";

$resultado = $conn->query($sql);

$trens = [];

while ($trem = $resultado->fetch_assoc()) {
    $trens[] = $trem;
}

echo json_encode($trens);

$conn->close();
?>