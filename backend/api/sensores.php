<?php

$conn = new mysqli("localhost", "root", "", "ferrorama");

if ($conn->connect_error) {
    die("Erro na conexão");
}

$conn->set_charset("utf8mb4");


/* =========================
   SENSORES
========================= */

$sql = "
    SELECT 
        sensores.id,
        sensores.codigo,
        sensores.tipo,
        sensores.trem_id,
        sensores.unidade,
        sensores.limite_min,
        sensores.limite_max,
        sensores.ultima_leitura,
        sensores.status,
        sensores.atualizado_em,
        trens.codigo AS trem_codigo
    FROM sensores
    INNER JOIN trens ON sensores.trem_id = trens.id
    ORDER BY sensores.id
";

$resultado = $conn->query($sql);

$sensores = [];

while ($sensor = $resultado->fetch_assoc()) {
    $sensores[] = $sensor;
}


/* =========================
   ALERTAS
========================= */

$sql_alertas = "
    SELECT
        alertas.id,
        alertas.titulo,
        alertas.descricao,
        alertas.gravidade,
        alertas.criado_em,
        sensores.codigo AS sensor_codigo,
        sensores.tipo,
        sensores.ultima_leitura,
        sensores.unidade,
        trens.codigo AS trem_codigo
    FROM alertas
    LEFT JOIN sensores ON alertas.sensor_id = sensores.id
    INNER JOIN trens ON alertas.trem_id = trens.id
    WHERE alertas.resolvido = 0
    ORDER BY alertas.criado_em DESC
";

$resultado_alertas = $conn->query($sql_alertas);

$alertas = [];

while ($alerta = $resultado_alertas->fetch_assoc()) {
    $alertas[] = $alerta;
}


/* =========================
   LEITURAS PARA O GRÁFICO
========================= */

$sql_leituras = "
    SELECT
        leituras.sensor_id,
        sensores.codigo,
        sensores.tipo,
        sensores.unidade,
        leituras.valor,
        leituras.lida_em
    FROM leituras
    INNER JOIN sensores ON leituras.sensor_id = sensores.id
    WHERE leituras.lida_em >= NOW() - INTERVAL 24 HOUR
    ORDER BY leituras.lida_em
";

$resultado_leituras = $conn->query($sql_leituras);

$leituras = [];

while ($leitura = $resultado_leituras->fetch_assoc()) {
    $leituras[] = $leitura;
}


/* =========================
   RETORNO
========================= */

echo json_encode([
    "sensores" => $sensores,
    "alertas" => $alertas,
    "leituras" => $leituras
]);

$conn->close();

?>