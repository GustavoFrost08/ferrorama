<?php
ini_set("display_errors", 0);

require "conexao.php";

$inicio = $_GET["inicio"];
$fim    = $_GET["fim"];
$trem   = (int) $_GET["trem"];  

if ($inicio == "") {
    $inicio = "2000-01-01";
}

if ($fim == "") {
    $fim = "2100-12-31";
}

$sql = "SELECT t.codigo AS trem, DATE(l.lida_em) AS dia, COUNT(*) AS qtd
        FROM leituras l
        JOIN sensores s ON l.sensor_id = s.id
        JOIN trens t ON s.trem_id = t.id
        WHERE (l.valor > s.limite_max OR l.valor < s.limite_min)
          AND DATE(l.lida_em) BETWEEN ? AND ?
          AND (? = 0 OR t.id = ?)
        GROUP BY t.codigo, DATE(l.lida_em)
        ORDER BY dia, t.codigo";

$comando = $conn->prepare($sql);

if ($comando === false) {
    echo json_encode(["erro" => $conn->error]);
    exit;
}

$comando->bind_param("ssii", $inicio, $fim, $trem, $trem);
$comando->execute();

$resultado = $comando->get_result();

$ocorrencias = [];

while ($linha = $resultado->fetch_assoc()) {
    $ocorrencias[] = $linha;
}

echo json_encode($ocorrencias);

$comando->close();
$conn->close();
?>