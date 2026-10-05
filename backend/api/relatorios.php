<?php
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

// não deixa o PHP "explodir" se uma consulta falhar
mysqli_report(MYSQLI_REPORT_OFF);

const MAX_LINHAS = 3;   // quantos trens aparecem no gráfico de linha

// MySQL do XAMPP rodando na porta 3308
$conn = @new mysqli("127.0.0.1", "root", "", "ferrorama", 3308);

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["erro" => "Erro ao conectar com o banco"]);
    exit;
}
$conn->set_charset("utf8mb4");

// ---------- filtros: ?inicio=2026-05-01&fim=2026-05-12&trem=2 ----------
function dataValida($texto) {
    $d = DateTime::createFromFormat('Y-m-d', $texto);
    return $d && $d->format('Y-m-d') === $texto;
}

$inicio = $_GET['inicio'] ?? date('Y-m-d', strtotime('-11 days'));
$fim    = $_GET['fim']    ?? date('Y-m-d');
$tremId = isset($_GET['trem']) ? (int)$_GET['trem'] : 0;   // "todos" vira 0

if (!dataValida($inicio) || !dataValida($fim)) {
    http_response_code(400);
    echo json_encode(["erro" => "Datas inválidas"]);
    exit;
}

if ($inicio > $fim) {
    [$inicio, $fim] = [$fim, $inicio];
}

// limita o período a 92 dias para o gráfico não ficar gigante
$dInicio = new DateTime($inicio);
$dFim    = new DateTime($fim);
if ($dInicio->diff($dFim)->days > 92) {
    $inicio = (clone $dFim)->modify('-92 days')->format('Y-m-d');
}

// executa um SELECT e devolve um array de linhas (ou null se falhar)
function linhas($conn, $sql) {
    $res = $conn->query($sql);
    if ($res === false) return null;
    $out = [];
    while ($l = $res->fetch_assoc()) $out[] = $l;
    return $out;
}

// ---------- cards: situação ATUAL dos sensores ----------
$where = $tremId ? "WHERE trem_id = $tremId" : "";
$normais = $alertas = $criticos = 0;

foreach (linhas($conn, "SELECT status, COUNT(*) AS qtd FROM sensores $where GROUP BY status") ?? [] as $l) {
    if ($l['status'] === 'normal')  $normais  = (int)$l['qtd'];
    if ($l['status'] === 'alerta')  $alertas  = (int)$l['qtd'];
    if ($l['status'] === 'critico') $criticos = (int)$l['qtd'];
}

// ---------- tabela: um registro por trem ----------
$whereTrem = $tremId ? "WHERE t.id = $tremId" : "";
$sql = "
    SELECT t.id, t.codigo,
           COUNT(s.id) AS sensores,
           COALESCE(SUM(s.status = 'critico'), 0) AS criticos,
           COALESCE(SUM(s.status = 'alerta'),  0) AS alertas,
           COALESCE(SUM(s.status = 'normal'),  0) AS normais
      FROM trens t
      LEFT JOIN sensores s ON s.trem_id = t.id
      $whereTrem
     GROUP BY t.id, t.codigo
     ORDER BY t.id";

$trens = [];
foreach (linhas($conn, $sql) ?? [] as $l) {
    $c = (int)$l['criticos'];
    $a = (int)$l['alertas'];
    $trens[] = [
        "id"       => (int)$l['id'],
        "codigo"   => $l['codigo'],
        "sensores" => (int)$l['sensores'],
        "criticos" => $c,
        "alertas"  => $a,
        "normais"  => (int)$l['normais'],
        "status"   => $c > 0 ? "CRÍTICO" : ($a > 0 ? "ATENÇÃO" : "NORMAL")
    ];
}

// ---------- lista de trens (para os selects) ----------
$trensLista = [];
foreach (linhas($conn, "SELECT id, codigo FROM trens ORDER BY id") ?? [] as $l) {
    $trensLista[] = ["id" => (int)$l['id'], "codigo" => $l['codigo']];
}

// ---------- gráfico de linha: alertas por dia e por trem ----------
// "Ocorrência" = registro da tabela alertas (gravidade alerta ou critico)
$filtroAlertas = "DATE(criado_em) BETWEEN '$inicio' AND '$fim'" . ($tremId ? " AND trem_id = $tremId" : "");

$porDia = linhas($conn, "
    SELECT DATE(criado_em) AS dia, trem_id, COUNT(*) AS qtd
      FROM alertas
     WHERE $filtroAlertas
     GROUP BY dia, trem_id") ?? [];

$mapa = [];      // $mapa[dia][trem_id] = quantidade
$totais = [];    // $totais[trem_id]    = total no período
foreach ($porDia as $l) {
    $t = (int)$l['trem_id'];
    $mapa[$l['dia']][$t] = (int)$l['qtd'];
    $totais[$t] = ($totais[$t] ?? 0) + (int)$l['qtd'];
}

// todos os dias do período
$dias = [];
$periodo = new DatePeriod(new DateTime($inicio), new DateInterval('P1D'), (new DateTime($fim))->modify('+1 day'));
foreach ($periodo as $d) $dias[] = $d->format('Y-m-d');

// escolhe os trens com mais ocorrências (empate: menor id)
$candidatos = array_values(array_filter($trensLista, fn($t) => !$tremId || $t['id'] === $tremId));
usort($candidatos, function ($a, $b) use ($totais) {
    return (($totais[$b['id']] ?? 0) <=> ($totais[$a['id']] ?? 0)) ?: ($a['id'] <=> $b['id']);
});
$escolhidos = array_slice($candidatos, 0, MAX_LINHAS);
usort($escolhidos, fn($a, $b) => $a['id'] <=> $b['id']);

$series = [];
foreach ($escolhidos as $t) {
    $valores = [];
    foreach ($dias as $dia) $valores[] = $mapa[$dia][$t['id']] ?? 0;
    $series[] = ["trem" => $t['codigo'], "valores" => $valores];
}

// ---------- rosca: críticas e alertas (tabela alertas) + leituras normais ----------
$tipos = ["critico" => 0, "alerta" => 0, "normal" => 0];

foreach (linhas($conn, "SELECT gravidade, COUNT(*) AS qtd FROM alertas WHERE $filtroAlertas GROUP BY gravidade") ?? [] as $l) {
    if (isset($tipos[$l['gravidade']])) $tipos[$l['gravidade']] = (int)$l['qtd'];
}

// leitura normal = valor dentro dos limites min/max do sensor
$filtroLeituras = "DATE(l.lida_em) BETWEEN '$inicio' AND '$fim'" . ($tremId ? " AND s.trem_id = $tremId" : "");
$r = linhas($conn, "
    SELECT COUNT(*) AS qtd
      FROM leituras l
      JOIN sensores s ON s.id = l.sensor_id
     WHERE $filtroLeituras
       AND l.valor BETWEEN s.limite_min AND s.limite_max");
$tipos["normal"] = (int)($r[0]['qtd'] ?? 0);

// ---------- resposta ----------
echo json_encode([
    "totalSensores"    => $normais + $alertas + $criticos,
    "sensoresNormais"  => $normais,
    "sensoresAlerta"   => $alertas,
    "sensoresCriticos" => $criticos,
    "trens"            => $trens,
    "trensLista"       => $trensLista,
    "grafico"          => ["labels" => $dias, "series" => $series],
    "tipos"            => $tipos,
    "atualizadoEm"     => date('H:i:s')
], JSON_UNESCAPED_UNICODE);

$conn->close();