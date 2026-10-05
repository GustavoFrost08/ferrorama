async function carregarAlertas(){

    try{

        let resposta=await fetch("/ferrorama/backend/api/sensores.php");
        let dados=await resposta.json();

        let lista=document.getElementById("todos-alertas");
        lista.innerHTML="";

        dados.alertas.forEach(a=>{

            lista.innerHTML+=`
                <div class="alerta-completo ${a.gravidade}">
                    <strong>${a.titulo}</strong>

                    <span>
                        ${a.trem_codigo || ""} -
                        ${a.tipo ? formatarTipo(a.tipo) : ""}
                    </span>

                    <span>
                        ${a.descricao || ""}
                    </span>

                    <span>
                        Sensor: ${a.sensor_codigo || "-"}
                    </span>

                    <span class="alerta-data">
                        ${formatarData(a.criado_em)}
                    </span>
                </div>
            `;

        });

    }catch(erro){

        console.log(erro);

    }

}

function formatarTipo(tipo){

    let tipos={
        temperatura:"Temperatura",
        vibracao:"Vibração",
        velocidade:"Velocidade",
        pressao:"Pressão"
    };

    return tipos[tipo]||tipo;
}

function formatarData(data){

    if(!data) return "-";

    return new Date(data).toLocaleString("pt-BR");
}

carregarAlertas();