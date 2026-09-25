<?php

header("Content-Type: application/json; charset=UTF-8");

require_once "conexao.php";

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

if (empty($identificador) || empty($senha)) {
    echo json_encode([
        "sucesso" => false,
        "mensagem" => "Preencha todos os campos."
    ]);
    exit;
}

$sql = "SELECT id, nome, sobrenome, email, telefone, senha, perfil, status
        FROM usuarios
        WHERE email = ? OR telefone = ?
        LIMIT 1";

$stmt = $conn->prepare($sql);

if (!$stmt) {
    echo json_encode([
        "sucesso" => false,
        "mensagem" => "Erro ao preparar login."
    ]);
    exit;
}

$stmt->bind_param("ss", $identificador, $identificador);
$stmt->execute();

$resultado = $stmt->get_result();

if ($resultado->num_rows === 0) {
    echo json_encode([
        "sucesso" => false,
        "mensagem" => "Usuário ou senha incorretos."
    ]);
    exit;
}

$usuario = $resultado->fetch_assoc();

if ($usuario["status"] !== "ativo") {
    echo json_encode([
        "sucesso" => false,
        "mensagem" => "Este usuário está inativo."
    ]);
    exit;
}

if (!password_verify($senha, $usuario["senha"])) {
    echo json_encode([
        "sucesso" => false,
        "mensagem" => "Usuário ou senha incorretos."
    ]);
    exit;
}

unset($usuario["senha"]);

echo json_encode([
    "sucesso" => true,
    "mensagem" => "Login realizado com sucesso!",
    "usuario" => $usuario
]);

$stmt->close();
$conn->close();
?>