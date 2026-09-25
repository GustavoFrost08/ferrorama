<?php

header("Content-Type: application/json; charset=UTF-8");

require_once __DIR__ . "/conexao.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo json_encode([
        "sucesso" => false,
        "mensagem" => "Método não permitido."
    ]);
    exit;
}

$dados = json_decode(file_get_contents("php://input"), true);

$identificador = trim($dados["identificador"] ?? "");
$senha = trim($dados["senha"] ?? "");
$nome = trim($dados["nome"] ?? "");
$sobrenome = trim($dados["sobrenome"] ?? "");
$data_nascimento = $dados["data_nascimento"] ?? "";

if (
    empty($identificador) ||
    empty($senha) ||
    empty($nome) ||
    empty($sobrenome) ||
    empty($data_nascimento)
) {
    echo json_encode([
        "sucesso" => false,
        "mensagem" => "Preencha todos os campos."
    ]);
    exit;
}

if (filter_var($identificador, FILTER_VALIDATE_EMAIL)) {
    $email = $identificador;
    $telefone = null;
} else {
    $email = null;
    $telefone = $identificador;
}

$senhaHash = password_hash($senha, PASSWORD_DEFAULT);

$sql = "INSERT INTO usuarios
        (nome, sobrenome, email, telefone, senha, data_nascimento)
        VALUES (?, ?, ?, ?, ?, ?)";

$stmt = $conn->prepare($sql);

if (!$stmt) {
    echo json_encode([
        "sucesso" => false,
        "mensagem" => "Erro ao preparar cadastro."
    ]);
    exit;
}

$stmt->bind_param(
    "ssssss",
    $nome,
    $sobrenome,
    $email,
    $telefone,
    $senhaHash,
    $data_nascimento
);

if ($stmt->execute()) {

    echo json_encode([
        "sucesso" => true,
        "mensagem" => "Cadastro realizado com sucesso!"
    ]);

} else {

    if ($stmt->errno == 1062) {
        echo json_encode([
            "sucesso" => false,
            "mensagem" => "Este e-mail ou telefone já está cadastrado."
        ]);
    } else {
        echo json_encode([
            "sucesso" => false,
            "mensagem" => "Erro ao realizar cadastro."
        ]);
    }
}

$stmt->close();
$conn->close();

?>