<?php
header('Content-Type: application/json; charset=utf-8');

$host = "localhost";
$usuario = "root";
$senha = "";
$banco = "ferrorama";

$conn = new mysqli($host, $usuario, $senha, $banco);

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["erro" => "Erro ao conectar com o banco"]);
    exit;
}

$conn->set_charset("utf8mb4");

$sql = "SELECT COUNT(*) AS total FROM sensores";
$resultado = $conn->query($sql);
$totalSensores = (int)$resultado->fetch_assoc()['total'];

$sql = "SELECT status, COUNT(*) AS quantidade FROM sensores GROUP BY status";
$resultado = $conn->query($sql);

$sensoresNormais = 0;
$sensoresAlerta = 0;
$sensoresCriticos = 0;

while ($linha = $resultado->fetch_assoc()) {
    if ($linha['status'] == 'normal') {
        $sensoresNormais = (int)$linha['quantidade'];
    }
    if ($linha['status'] == 'alerta') {
        $sensoresAlerta = (int)$linha['quantidade'];
    }
    if ($linha['status'] == 'critico') {
        $sensoresCriticos = (int)$linha['quantidade'];
    }
}

$sql = "
SELECT
    t.id,
    t.codigo,
    COUNT(s.id) AS sensores,
    SUM(CASE WHEN s.status = 'critico' THEN 1 ELSE 0 END) AS criticos,
    SUM(CASE WHEN s.status = 'alerta' THEN 1 ELSE 0 END) AS alertas,
    SUM(CASE WHEN s.status = 'normal' THEN 1 ELSE 0 END) AS normais
FROM trens t
LEFT JOIN sensores s ON s.trem_id = t.id
GROUP BY t.id, t.codigo
ORDER BY t.id
";

$resultado = $conn->query($sql);
$trens = [];

while ($linha = $resultado->fetch_assoc()) {
    $criticos = (int)$linha['criticos'];
    $alertas = (int)$linha['alertas'];

    if ($criticos > 0) {
        $status = "CRÍTICO";
    } elseif ($alertas > 0) {
        $status = "ATENÇÃO";
    } else {
        $status = "NORMAL";
    }

    $trens[] = [
        "codigo" => $linha['codigo'],
        "sensores" => (int)$linha['sensores'],
        "criticos" => $criticos,
        "alertas" => $alertas,
        "normais" => (int)$linha['normais'],
        "status" => $status
    ];
}

$resposta = [
    "totalSensores" => $totalSensores,
    "sensoresNormais" => $sensoresNormais,
    "sensoresAlerta" => $sensoresAlerta,
    "sensoresCriticos" => $sensoresCriticos,
    "trens" => $trens
];

echo json_encode($resposta, JSON_UNESCAPED_UNICODE);

$conn->close();
?>