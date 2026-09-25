<?php

header('Content-Type: application/json; charset=utf-8');

require_once 'conexao.php';

try {

    $sql = "SELECT 
                e.id,
                e.titulo,
                e.descricao,
                e.criado_em,
                t.codigo AS trem
            FROM eventos e
            LEFT JOIN trens t ON e.trem_id = t.id
            ORDER BY e.criado_em DESC
            LIMIT 4";

    $resultado = $conn->query($sql);

    $eventos = [];

    while ($linha = $resultado->fetch_assoc()) {
        $eventos[] = $linha;
    }

    echo json_encode($eventos);

} catch (Exception $e) {

    echo json_encode([
        "erro" => true,
        "mensagem" => $e->getMessage()
    ]);
}
?>