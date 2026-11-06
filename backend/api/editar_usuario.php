<?php
ini_set("display_errors", 0);

require "conexao.php";

if ($_SERVER["REQUEST_METHOD"] != "POST") {
    echo json_encode(["sucesso" => false, "erro" => "Método inválido"]);
    exit;
}

$id        = (int) $_POST["id"];
$nome      = trim($_POST["nome"]);
$sobrenome = trim($_POST["sobrenome"]);
$email     = trim($_POST["email"]);
$senha     = $_POST["senha"];
$perfil    = $_POST["perfil"];
$status    = $_POST["status"];

if ($id == 0 || $nome == "" || $sobrenome == "" || $email == "") {
    echo json_encode(["sucesso" => false, "erro" => "Preencha todos os campos"]);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(["sucesso" => false, "erro" => "E-mail inválido"]);
    exit;
}

if ($perfil != "admin" && $perfil != "operador" && $perfil != "comum") {
    echo json_encode(["sucesso" => false, "erro" => "Perfil inválido"]);
    exit;
}

if ($status != "ativo" && $status != "inativo") {
    echo json_encode(["sucesso" => false, "erro" => "Status inválido"]);
    exit;
}

$busca = $conn->prepare("SELECT id FROM usuarios WHERE email = ? AND id != ?");
$busca->bind_param("si", $email, $id);
$busca->execute();
$busca->store_result();

if ($busca->num_rows > 0) {
    echo json_encode(["sucesso" => false, "erro" => "Já existe outro usuário com esse e-mail"]);
    exit;
}

$busca->close();

if ($senha == "") {
    $sql = "UPDATE usuarios SET nome = ?, sobrenome = ?, email = ?, perfil = ?, status = ? WHERE id = ?";
    $comando = $conn->prepare($sql);
    $comando->bind_param("sssssi", $nome, $sobrenome, $email, $perfil, $status, $id);
} else {
    if (strlen($senha) < 6) {
        echo json_encode(["sucesso" => false, "erro" => "A senha precisa ter pelo menos 6 caracteres"]);
        exit;
    }

    $senhaCriptografada = password_hash($senha, PASSWORD_DEFAULT);
    $sql = "UPDATE usuarios SET nome = ?, sobrenome = ?, email = ?, senha = ?, perfil = ?, status = ? WHERE id = ?";
    $comando = $conn->prepare($sql);
    $comando->bind_param("ssssssi", $nome, $sobrenome, $email, $senhaCriptografada, $perfil, $status, $id);
}

if ($comando->execute()) {
    echo json_encode(["sucesso" => true]);
} else {
    echo json_encode(["sucesso" => false, "erro" => $comando->error]);
}

$comando->close();
$conn->close();
?>