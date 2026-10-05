<?php
ini_set("display_errors", 0);

require "conexao.php";

if ($_SERVER["REQUEST_METHOD"] != "POST") {
    echo json_encode(["sucesso" => false, "erro" => "Método inválido"]);
    exit;
}

$numero_serie = $_POST["numero_serie"];
$modelo       = $_POST["modelo"];
$linha        = $_POST["linha"];
$localizacao  = $_POST["localizacao"];
$velocidade   = (int) $_POST["velocidade"];
$status       = $_POST["status"];
$data         = $_POST["data_cadastro"];

if ($numero_serie == "" || $modelo == "" || $linha == "" || $localizacao == "" || $status == "" || $data == "") {
    echo json_encode(["sucesso" => false, "erro" => "Preencha todos os campos"]);
    exit;
}

$resultado = $conn->query("SELECT MAX(id) AS maior FROM trens");
$linhaMax = $resultado->fetch_assoc();
$proximo = $linhaMax["maior"] + 1;
$codigo = "TR-" . str_pad($proximo, 3, "0", STR_PAD_LEFT);

$sql = "INSERT INTO trens (codigo, numero_serie, modelo, linha, localizacao_atual, velocidade_atual, status, data_cadastro)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

$comando = $conn->prepare($sql);

if ($comando === false) {
    echo json_encode(["sucesso" => false, "erro" => $conn->error]);
    exit;
}

$comando->bind_param("sssssiss", $codigo, $numero_serie, $modelo, $linha, $localizacao, $velocidade, $status, $data);

if ($comando->execute()) {

    $novo_id = $conn->insert_id;

    $tituloEvento = $codigo . " - Trem cadastrado";
    $descricaoEvento = $linha . " - " . $localizacao;

    $evento = $conn->prepare("INSERT INTO eventos (trem_id, titulo, descricao) VALUES (?, ?, ?)");

    if ($evento !== false) {
        $evento->bind_param("iss", $novo_id, $tituloEvento, $descricaoEvento);
        $evento->execute();
        $evento->close();
    }

    echo json_encode(["sucesso" => true]);

} else {
    echo json_encode(["sucesso" => false, "erro" => $comando->error]);
}

$comando->close();
$conn->close();
?>