<?php
// api/visao_geral.php
header("Content-Type: application/json; charset=utf-8");
require "conexao.php";

$sql = "SELECT status, COUNT(*) AS total FROM trens GROUP BY status";
$resultado = $conn->query($sql);

$contagem = [
    "em_operacao"   => 0,
    "em_manutencao" => 0,
    "parado"        => 0
];

while ($linha = $resultado->fetch_assoc()) {
    if (isset($contagem[$linha["status"]])) {
        $contagem[$linha["status"]] = (int) $linha["total"];
    }
}

echo json_encode([
    "trens_ativos" => $contagem["em_operacao"],
    "em_manutencao" => $contagem["em_manutencao"],
    "parado" => $contagem["parado"]
]);

$conn->close();