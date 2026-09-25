let sensores = [];
let alertas = [];
let leituras = [];


/* =========================
   CARREGAR DADOS
========================= */

async function carregarSensores() {

    const resposta = await fetch("/backend/sensores.php");

    const dados = await resposta.json();

    sensores = dados.sensores;
    alertas = dados.alertas;
    leituras = dados.leituras;


    mostrarCards();

    preencherTrens();

    mostrarTabela();

    mostrarAlertas();

    criarGrafico();

}


/* =========================
   CARDS
========================= */

function mostrarCards() {

    const total = sensores.length;

    const normais = sensores.filter(
        sensor => sensor.status === "normal"
    ).length;

    const alerta = sensores.filter(
        sensor => sensor.status === "alerta"
    ).length;

    const criticos = sensores.filter(
        sensor => sensor.status === "critico"
    ).length;


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


/* =========================
   FILTRO DE TRENS
========================= */

function preencherTrens() {

    const select = document.getElementById("filtroTrem");

    const trens = [];

    sensores.forEach(sensor => {

        if (!trens.includes(sensor.trem_codigo)) {
            trens.push(sensor.trem_codigo);
        }

    });


    trens.forEach(trem => {

        const option = document.createElement("option");

        option.value = trem;

        option.textContent = trem;

        select.appendChild(option);

    });

}


/* =========================
   TABELA
========================= */

function mostrarTabela() {

    const tabela = document.getElementById("tabelaSensores");

    tabela.innerHTML = "";


    const busca =
        document.getElementById("buscaSensor").value.toLowerCase();

    const tipo =
        document.getElementById("filtroTipo").value;

    const trem =
        document.getElementById("filtroTrem").value;

    const status =
        document.getElementById("filtroStatus").value;


    const sensoresFiltrados = sensores.filter(sensor => {

        const correspondeBusca =
            sensor.codigo.toLowerCase().includes(busca);

        const correspondeTipo =
            tipo === "todos" || sensor.tipo === tipo;

        const correspondeTrem =
            trem === "todos" || sensor.trem_codigo === trem;

        const correspondeStatus =
            status === "todos" || sensor.status === status;


        return (
            correspondeBusca &&
            correspondeTipo &&
            correspondeTrem &&
            correspondeStatus
        );

    });


    sensoresFiltrados.forEach(sensor => {

        const linha = document.createElement("tr");


        linha.innerHTML = `

            <td>
                ${sensor.codigo}
            </td>

            <td>
                ${formatarTipo(sensor.tipo)}
            </td>

            <td>
                ${sensor.trem_codigo}
            </td>

            <td class="${sensor.status}">
                ${sensor.ultima_leitura} ${sensor.unidade}
            </td>

            <td>
                ${sensor.limite_min} ${sensor.unidade}
                -
                ${sensor.limite_max} ${sensor.unidade}
            </td>

            <td class="${sensor.status}">
                ${formatarStatus(sensor.status)}
            </td>

            <td>
                ${formatarData(sensor.atualizado_em)}
            </td>

        `;


        tabela.appendChild(linha);

    });

}


/* =========================
   TIPOS
========================= */

function formatarTipo(tipo) {

    if (tipo === "temperatura") {
        return "Temperatura";
    }

    if (tipo === "vibracao") {
        return "Vibração";
    }

    if (tipo === "velocidade") {
        return "Velocidade";
    }

    if (tipo === "pressao") {
        return "Pressão";
    }

    return tipo;

}


/* =========================
   STATUS
========================= */

function formatarStatus(status) {

    if (status === "normal") {
        return "NORMAL";
    }

    if (status === "alerta") {
        return "ALERTA";
    }

    if (status === "critico") {
        return "CRÍTICO";
    }

    return status;

}


/* =========================
   DATA
========================= */

function formatarData(data) {

    if (!data) {
        return "-";
    }

    const dataObj = new Date(data);

    return dataObj.toLocaleString("pt-BR");

}


/* =========================
   ALERTAS
========================= */

function mostrarAlertas() {

    const lista =
        document.getElementById("listaAlertas");

    lista.innerHTML = "";


    alertas.forEach(alerta => {

        const div = document.createElement("div");

        div.className = "alerta_item " + alerta.gravidade;


        div.innerHTML = `

            <div class="icone_alerta">

                ${alerta.gravidade === "critico" ? "×" : "!"}

            </div>


            <div class="texto_alerta">

                <strong>
                    ${alerta.sensor_codigo || alerta.titulo}
                </strong>

                <span>
                    ${alerta.trem_codigo} - ${formatarTipo(alerta.tipo || "")}
                </span>

            </div>


            <div class="valor_alerta">

                ${alerta.ultima_leitura || ""} 
                ${alerta.unidade || ""}

                <small>
                    ${alerta.gravidade === "critico"
                        ? "Fora do intervalo"
                        : "Próximo do limite"}
                </small>

            </div>

        `;


        lista.appendChild(div);

    });

}


/* =========================
   GRÁFICO
========================= */

function criarGrafico() {

    const canvas =
        document.getElementById("graficoSensores");

    const ctx = canvas.getContext("2d");


    canvas.width = canvas.offsetWidth;

    canvas.height = canvas.offsetHeight;


    const largura = canvas.width;

    const altura = canvas.height;


    ctx.clearRect(0, 0, largura, altura);


    /* LINHAS HORIZONTAIS */

    ctx.strokeStyle = "rgba(255,255,255,0.1)";

    ctx.lineWidth = 1;


    for (let i = 0; i <= 5; i++) {

        const y = 20 + (i * (altura - 40) / 5);

        ctx.beginPath();

        ctx.moveTo(0, y);

        ctx.lineTo(largura, y);

        ctx.stroke();

    }


    /* DESENHAR DADOS */

    const tipos = [
        "temperatura",
        "vibracao",
        "velocidade"
    ];


    tipos.forEach(tipo => {

        const dados = leituras.filter(
            leitura => leitura.tipo === tipo
        );


        if (dados.length < 2) {
            return;
        }


        let maior = Math.max(
            ...dados.map(d => Number(d.valor))
        );

        let menor = Math.min(
            ...dados.map(d => Number(d.valor))
        );


        if (maior === menor) {
            maior++;
        }


        ctx.beginPath();


        dados.forEach((dado, index) => {

            const x =
                (index / (dados.length - 1)) *
                (largura - 20) + 10;


            const y =
                altura - 20 -
                ((Number(dado.valor) - menor) /
                (maior - menor)) *
                (altura - 40);


            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }

        });


        if (tipo === "temperatura") {
            ctx.strokeStyle = "#ef4444";
        }

        if (tipo === "vibracao") {
            ctx.strokeStyle = "#f59e0b";
        }

        if (tipo === "velocidade") {
            ctx.strokeStyle = "#22c55e";
        }


        ctx.lineWidth = 3;

        ctx.stroke();

    });

}


/* =========================
   FILTROS
========================= */

document
    .getElementById("buscaSensor")
    .addEventListener("input", mostrarTabela);

document
    .getElementById("filtroTipo")
    .addEventListener("change", mostrarTabela);

document
    .getElementById("filtroTrem")
    .addEventListener("change", mostrarTabela);

document
    .getElementById("filtroStatus")
    .addEventListener("change", mostrarTabela);


/* =========================
   INICIAR
========================= */

carregarSensores();