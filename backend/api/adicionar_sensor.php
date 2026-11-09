<?php
ini_set("display_errors", 0);

require "conexao.php";

if ($_SERVER["REQUEST_METHOD"] != "POST") {
    echo json_encode(["sucesso" => false, "erro" => "Método inválido"]);
    exit;
}

$codigo     = strtoupper(trim($_POST["codigo"]));
$tipo       = $_POST["tipo"];
$trem_id    = (int) $_POST["trem_id"];
$limite_min = $_POST["limite_min"];
$limite_max = $_POST["limite_max"];
$leitura    = $_POST["ultima_leitura"];

if ($codigo == "" || $tipo == "" || $trem_id == 0 || $limite_min == "" || $limite_max == "" || $leitura == "") {
    echo json_encode(["sucesso" => false, "erro" => "Preencha todos os campos"]);
    exit;
}

if (strlen($codigo) > 10) {
    echo json_encode(["sucesso" => false, "erro" => "O código pode ter no máximo 10 caracteres"]);
    exit;
}

if ($tipo != "temperatura" && $tipo != "vibracao" && $tipo != "velocidade" && $tipo != "pressao") {
    echo json_encode(["sucesso" => false, "erro" => "Tipo inválido"]);
    exit;
}

if (!is_numeric($limite_min) || !is_numeric($limite_max) || !is_numeric($leitura)) {
    echo json_encode(["sucesso" => false, "erro" => "Os limites e a leitura precisam ser números"]);
    exit;
}

$min   = (float) $limite_min;
$max   = (float) $limite_max;
$valor = (float) $leitura;

if ($min >= $max) {
    echo json_encode(["sucesso" => false, "erro" => "O limite mínimo precisa ser menor que o máximo"]);
    exit;
}

$busca = $conn->prepare("SELECT id FROM sensores WHERE codigo = ?");
$busca->bind_param("s", $codigo);
$busca->execute();
$busca->store_result();

if ($busca->num_rows > 0) {
    echo json_encode(["sucesso" => false, "erro" => "Já existe um sensor com esse código"]);
    exit;
}

$busca->close();

$busca = $conn->prepare("SELECT id FROM trens WHERE id = ?");
$busca->bind_param("i", $trem_id);
$busca->execute();
$busca->store_result();

if ($busca->num_rows == 0) {
    echo json_encode(["sucesso" => false, "erro" => "Trem não encontrado"]);
    exit;
}

$busca->close();

$unidade = "bar";

if ($tipo == "temperatura") {
    $unidade = "°C";
}

if ($tipo == "vibracao") {
    $unidade = "mm/s";
}

if ($tipo == "velocidade") {
    $unidade = "km/h";
}

$status = "normal";

if ($valor < $min || $valor > $max) {
    $status = "alerta";
}

$sql = "INSERT INTO sensores (codigo, tipo, trem_id, unidade, limite_min, limite_max, ultima_leitura, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

$comando = $conn->prepare($sql);

if ($comando === false) {
    echo json_encode(["sucesso" => false, "erro" => $conn->error]);
    exit;
}

$comando->bind_param("ssisddds", $codigo, $tipo, $trem_id, $unidade, $min, $max, $valor, $status);

if ($comando->execute()) {

    $novo_id = $comando->insert_id;

    $leituraNova = $conn->prepare("INSERT INTO leituras (sensor_id, valor) VALUES (?, ?)");

    if ($leituraNova !== false) {
        $leituraNova->bind_param("id", $novo_id, $valor);
        $leituraNova->execute();
        $leituraNova->close();
    }

    echo json_encode(["sucesso" => true]);

} else {
    echo json_encode(["sucesso" => false, "erro" => $comando->error]);
}

$comando->close();
$conn->close();
?>