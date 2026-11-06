<?php

session_start();
header("Content-Type: application/json; charset=UTF-8");

require_once "conexao.php";

if (!isset($_SESSION["usuario_id"])) {
    echo json_encode(["sucesso" => false, "mensagem" => "Faça login novamente."]);
    exit;
}

$dados = json_decode(file_get_contents("php://input"), true);
$id = $_SESSION["usuario_id"];
$acao = $dados["acao"] ?? "buscar";

if ($acao == "buscar") {

    $sql = "SELECT id, nome, sobrenome, email, telefone, perfil, status
            FROM usuarios WHERE id = ?";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $id);
    $stmt->execute();

    $resultado = $stmt->get_result();

    if ($resultado->num_rows == 0) {
        echo json_encode(["sucesso" => false, "mensagem" => "Usuário não encontrado."]);
        exit;
    }

    echo json_encode([
        "sucesso" => true,
        "usuario" => $resultado->fetch_assoc()
    ]);

} elseif ($acao == "atualizar") {

    $nome = trim($dados["nome"] ?? "");
    $sobrenome = trim($dados["sobrenome"] ?? "");
    $email = trim($dados["email"] ?? "");
    $telefone = trim($dados["telefone"] ?? "");

    if (!$nome || !$sobrenome || !$email || !$telefone) {
        echo json_encode(["sucesso" => false, "mensagem" => "Preencha todos os campos."]);
        exit;
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(["sucesso" => false, "mensagem" => "E-mail inválido."]);
        exit;
    }

    $sql = "SELECT id FROM usuarios
            WHERE (email = ? OR telefone = ?) AND id != ?";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssi", $email, $telefone, $id);
    $stmt->execute();

    if ($stmt->get_result()->num_rows > 0) {
        echo json_encode(["sucesso" => false, "mensagem" => "E-mail ou telefone já cadastrado."]);
        exit;
    }

    $sql = "UPDATE usuarios
            SET nome = ?, sobrenome = ?, email = ?, telefone = ?
            WHERE id = ?";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssssi", $nome, $sobrenome, $email, $telefone, $id);

    if ($stmt->execute()) {
        echo json_encode(["sucesso" => true, "mensagem" => "Dados atualizados com sucesso!"]);
    } else {
        echo json_encode(["sucesso" => false, "mensagem" => "Erro ao atualizar os dados."]);
    }

} elseif ($acao == "sair") {

    session_unset();
    session_destroy();

    echo json_encode(["sucesso" => true]);

}

$conn->close();
?>