<?php

header("Content-Type: application/json; charset=UTF-8");
require_once "conexao.php";

$sql = "SELECT sensores.id,sensores.codigo,sensores.tipo,sensores.trem_id,sensores.unidade,
sensores.limite_min,sensores.limite_max,sensores.ultima_leitura,sensores.status,
sensores.atualizado_em,trens.codigo AS trem_codigo
FROM sensores INNER JOIN trens ON sensores.trem_id=trens.id ORDER BY sensores.id";

$resultado=$conn->query($sql);

if(!$resultado){
    echo json_encode(["erro"=>true,"mensagem"=>"Erro ao buscar sensores: ".$conn->error]);
    exit;
}

$sensores=[];
while($sensor=$resultado->fetch_assoc())$sensores[]=$sensor;


$sql_alertas="SELECT alertas.id,alertas.titulo,alertas.descricao,alertas.gravidade,
alertas.criado_em,sensores.codigo AS sensor_codigo,sensores.tipo,
sensores.ultima_leitura,sensores.unidade,trens.codigo AS trem_codigo
FROM alertas
LEFT JOIN sensores ON alertas.sensor_id=sensores.id
INNER JOIN trens ON alertas.trem_id=trens.id
WHERE alertas.resolvido=0 ORDER BY alertas.criado_em DESC";

$resultado_alertas=$conn->query($sql_alertas);

if(!$resultado_alertas){
    echo json_encode(["erro"=>true,"mensagem"=>"Erro ao buscar alertas: ".$conn->error]);
    exit;
}

$alertas=[];
while($alerta=$resultado_alertas->fetch_assoc())$alertas[]=$alerta;


$sql_leituras="SELECT leituras.sensor_id,sensores.codigo,sensores.tipo,
sensores.unidade,leituras.valor,leituras.lida_em
FROM leituras INNER JOIN sensores ON leituras.sensor_id=sensores.id
ORDER BY leituras.lida_em DESC LIMIT 100";

$resultado_leituras=$conn->query($sql_leituras);

if(!$resultado_leituras){
    echo json_encode(["erro"=>true,"mensagem"=>"Erro ao buscar leituras: ".$conn->error]);
    exit;
}

$leituras=[];
while($leitura=$resultado_leituras->fetch_assoc())$leituras[]=$leitura;

$leituras=array_reverse($leituras);


$sql_trens="SELECT id,codigo FROM trens ORDER BY codigo";
$resultado_trens=$conn->query($sql_trens);

if(!$resultado_trens){
    echo json_encode(["erro"=>true,"mensagem"=>"Erro ao buscar trens: ".$conn->error]);
    exit;
}

$trens=[];
while($trem=$resultado_trens->fetch_assoc())$trens[]=$trem;


echo json_encode([
    "erro"=>false,
    "sensores"=>$sensores,
    "alertas"=>$alertas,
    "leituras"=>$leituras,
    "trens"=>$trens
]);

$conn->close();
?>