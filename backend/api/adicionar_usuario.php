<?php

ini_set("display_errors", 0);

require "conexao.php";

if ($_SERVER["REQUEST_METHOD"] != "POST") {
    echo json_encode(["sucesso" => false, "erro" => "Método inválido"]);
    exit;
}

$nome = trim($_POST["nome"]);
$sobrenome = trim($_POST["sobrenome"]);
$email = trim($_POST["email"]);
$senha = $_POST["senha"];
$perfil = $_POST["perfil"];
$status = $_POST["status"];

if ($nome == "" || $sobrenome == "" || $email == "" || $senha == "") {
    echo json_encode(["sucesso" => false, "erro" => "Preencha todos os campos"]);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(["sucesso" => false, "erro" => "E-mail inválido"]);
    exit;
}

if (strlen($senha) < 6) {
    echo json_encode(["sucesso" => false, "erro" => "A senha precisa ter pelo menos 6 caracteres"]);
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

$busca = $conn->prepare("SELECT id FROM usuarios WHERE email = ?");
$busca->bind_param("s", $email);
$busca->execute();
$busca->store_result();

if ($busca->num_rows > 0) {
    echo json_encode(["sucesso" => false, "erro" => "Já existe um usuário com esse e-mail"]);
    $busca->close();
    $conn->close();
    exit;
}

$busca->close();

$senhaCriptografada = password_hash($senha, PASSWORD_DEFAULT);

$sql = "INSERT INTO usuarios (nome, sobrenome, email, senha, perfil, status)
        VALUES (?, ?, ?, ?, ?, ?)";

$comando = $conn->prepare($sql);

$comando->bind_param("ssssss", $nome, $sobrenome, $email, $senhaCriptografada, $perfil, $status);

if ($comando->execute()) {
    echo json_encode(["sucesso" => true]);
} else {
    echo json_encode(["sucesso" => false, "erro" => $comando->error]);
}

$comando->close();
$conn->close();

?>