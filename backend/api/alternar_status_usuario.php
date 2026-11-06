<?php
ini_set("display_errors", 0);

require "conexao.php";

if ($_SERVER["REQUEST_METHOD"] != "POST") {
    echo json_encode(["sucesso" => false, "erro" => "Método inválido"]);
    exit;
}

$id = (int) $_POST["id"];

if ($id == 0) {
    echo json_encode(["sucesso" => false, "erro" => "Usuário inválido"]);
    exit;
}

$sql = "UPDATE usuarios SET status = IF(status = 'ativo', 'inativo', 'ativo') WHERE id = ?";

$comando = $conn->prepare($sql);
$comando->bind_param("i", $id);

if ($comando->execute()) {
    echo json_encode(["sucesso" => true]);
} else {
    echo json_encode(["sucesso" => false, "erro" => $comando->error]);
}

$comando->close();
$conn->close();
?>