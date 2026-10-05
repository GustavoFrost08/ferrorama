let sensores = [];
let alertas = [];
let leituras = [];
let trensDisponiveis = [];


async function carregarSensores() {
    try {
        const resposta = await fetch("/ferrorama/backend/api/sensores.php");
        const dados = await resposta.json();

        sensores = dados.sensores || [];
        alertas = dados.alertas || [];
        leituras = dados.leituras || [];
        trensDisponiveis = dados.trens || [];

        mostrarCards();
        preencherTrens();
        mostrarTabela();
        mostrarAlertas();
        criarGrafico();

    } catch (erro) {
        console.log("Erro ao carregar sensores:", erro);
    }
}


function mostrarCards() {
    let total = sensores.length;
    let normais = sensores.filter(s => s.status == "normal").length;
    let alerta = sensores.filter(s => s.status == "alerta").length;
    let criticos = sensores.filter(s => s.status == "critico").length;

    document.getElementById("totalSensores").textContent = total;
    document.getElementById("sensoresNormais").textContent = normais;
    document.getElementById("sensoresAlerta").textContent = alerta;
    document.getElementById("sensoresCriticos").textContent = criticos;

    if (total > 0) {
        document.getElementById("porcentagemNormal").textContent =
            ((normais / total) * 100).toFixed(1) + "% do total";

        document.getElementById("porcentagemAlerta").textContent =
            ((alerta / total) * 100).toFixed(1) + "% do total";

        document.getElementById("porcentagemCritico").textContent =
            ((criticos / total) * 100).toFixed(1) + "% do total";
    }
}


function preencherTrens() {
    let select = document.getElementById("filtroTrem");

    select.innerHTML = '<option value="todos">Todos os trens</option>';

    trensDisponiveis.forEach(function(trem) {
        let option = document.createElement("option");

        option.value = trem.codigo;
        option.textContent = trem.codigo;

        select.appendChild(option);
    });
}


function mostrarTabela() {
    let tabela = document.getElementById("tabelaSensores");

    let busca = document.getElementById("buscaSensor").value.toLowerCase();
    let tipo = document.getElementById("filtroTipo").value;
    let trem = document.getElementById("filtroTrem").value;
    let status = document.getElementById("filtroStatus").value;

    tabela.innerHTML = "";

    sensores.forEach(function(sensor) {

        let encontrouBusca = sensor.codigo.toLowerCase().includes(busca);
        let encontrouTipo = tipo == "todos" || sensor.tipo == tipo;
        let encontrouTrem = trem == "todos" || sensor.trem_codigo == trem;
        let encontrouStatus = status == "todos" || sensor.status == status;

        if (encontrouBusca && encontrouTipo && encontrouTrem && encontrouStatus) {

            tabela.innerHTML += `
                <tr>
                    <td>${sensor.codigo}</td>
                    <td>${formatarTipo(sensor.tipo)}</td>
                    <td>${sensor.trem_codigo}</td>
                    <td class="${sensor.status}">
                        ${sensor.ultima_leitura} ${sensor.unidade || ""}
                    </td>
                    <td>
                        ${sensor.limite_min} ${sensor.unidade || ""} -
                        ${sensor.limite_max} ${sensor.unidade || ""}
                    </td>
                    <td class="${sensor.status}">
                        ${formatarStatus(sensor.status)}
                    </td>
                    <td>${formatarData(sensor.atualizado_em)}</td>
                </tr>
            `;
        }
    });
}


function formatarTipo(tipo) {
    if (tipo == "temperatura") return "Temperatura";
    if (tipo == "vibracao") return "Vibração";
    if (tipo == "velocidade") return "Velocidade";
    if (tipo == "pressao") return "Pressão";

    return tipo;
}


function formatarStatus(status) {
    if (status == "normal") return "NORMAL";
    if (status == "alerta") return "ALERTA";
    if (status == "critico") return "CRÍTICO";

    return status;
}


function formatarData(data) {
    if (!data) return "-";

    return new Date(data).toLocaleString("pt-BR");
}


function mostrarAlertas() {
    let lista = document.getElementById("listaAlertas");

    lista.innerHTML = "";

    alertas.forEach(function(alerta) {

        let icone = alerta.gravidade == "critico" ? "×" : "!";

        let motivo = alerta.gravidade == "critico"
            ? "Fora do intervalo"
            : "Próximo do limite";

        lista.innerHTML += `
            <div class="alerta_item ${alerta.gravidade}">

                <div class="icone_alerta">
                    ${icone}
                </div>

                <div class="texto_alerta">
                    <strong>${alerta.sensor_codigo || alerta.titulo}</strong>

                    <span>
                        ${alerta.trem_codigo || ""} -
                        ${formatarTipo(alerta.tipo || "")}
                    </span>
                </div>

                <div class="valor_alerta">
                    ${alerta.ultima_leitura || ""} ${alerta.unidade || ""}

                    <small>${motivo}</small>
                </div>

            </div>
        `;
    });
}


function criarGrafico() {
    let canvas = document.getElementById("graficoSensores");
    let ctx = canvas.getContext("2d");

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    let largura = canvas.width;
    let altura = canvas.height;

    ctx.clearRect(0, 0, largura, altura);

    ctx.strokeStyle = "rgba(255,255,255,0.1)";

    for (let i = 0; i <= 5; i++) {
        let y = 20 + i * (altura - 40) / 5;

        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(largura, y);
        ctx.stroke();
    }

    let tipos = ["temperatura", "vibracao", "velocidade"];
    let filtro = document.getElementById("filtroGrafico").value;

    if (filtro != "todos") {
        tipos = [filtro];
    }

    tipos.forEach(function(tipo) {

        let dados = leituras.filter(function(leitura) {
            return leitura.tipo == tipo;
        });

        if (dados.length < 2) return;

        let valores = dados.map(function(dado) {
            return Number(dado.valor);
        });

        let maior = Math.max(...valores);
        let menor = Math.min(...valores);

        if (maior == menor) maior++;

        ctx.beginPath();

        dados.forEach(function(dado, i) {

            let x = 10 + i / (dados.length - 1) * (largura - 20);

            let y = altura - 20 -
                ((Number(dado.valor) - menor) / (maior - menor)) *
                (altura - 40);

            if (i == 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });

        if (tipo == "temperatura") {
            ctx.strokeStyle = "#ef4444";
        } else if (tipo == "vibracao") {
            ctx.strokeStyle = "#f59e0b";
        } else {
            ctx.strokeStyle = "#22c55e";
        }

        ctx.lineWidth = 3;
        ctx.stroke();
    });
}


document.getElementById("buscaSensor")
    .addEventListener("input", mostrarTabela);

document.getElementById("filtroTipo")
    .addEventListener("change", mostrarTabela);

document.getElementById("filtroTrem")
    .addEventListener("change", mostrarTabela);

document.getElementById("filtroStatus")
    .addEventListener("change", mostrarTabela);

document.getElementById("filtroGrafico")
    .addEventListener("change", criarGrafico);

window.addEventListener("resize", criarGrafico);

carregarSensores();