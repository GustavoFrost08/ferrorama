// dashboard.js
async function carregarVisaoGeral() {
    try {
       const resposta = await fetch("/ferrorama/backend/api/visao_geral.php");
        const dados = await resposta.json();

        document.getElementById("qtd-ativos").textContent = dados.trens_ativos;
        document.getElementById("qtd-manutencao").textContent = dados.em_manutencao;
        document.getElementById("qtd-parado").textContent = dados.parado;
    } catch (erro) {
        console.error("Erro ao carregar visão geral da frota:", erro);
    }
}

carregarVisaoGeral();

async function carregarIndicadores() {
    try {
        const resposta = await fetch("/ferrorama/backend/api/indicadores.php");
        const dados = await resposta.json();

        document.getElementById("velocidade-media").textContent =
            dados.velocidade_media + " km/h";

        document.getElementById("alertas-ativos").textContent =
            dados.alertas_ativos;

        document.getElementById("sensores-criticos").textContent =
            dados.sensores_criticos;

    } catch (erro) {
        console.error("Erro ao carregar indicadores:", erro);
    }
}

carregarIndicadores();

async function carregarEstadoFrota() {
    try {
        const resposta = await fetch("/ferrorama/backend/api/estado_frota.php");
        const dados = await resposta.json();

        const tabela = document.getElementById("tabela-frota");

        tabela.innerHTML = "";

        dados.forEach(trem => {

            const linha = document.createElement("tr");

            let status = trem.status;

            if (status === "em_operacao") {
                status = "Em operação";
            } else if (status === "em_manutencao") {
                status = "Em manutenção";
            } else if (status === "parado") {
                status = "Parado";
            } else if (status === "alerta_tecnico") {
                status = "Alerta técnico";
            } else if (status === "inspecao") {
                status = "Em inspeção";
            } else if (status === "fora_de_uso") {
                status = "Fora de uso em definitivo";
            }

            let data = "--";

            if (trem.data_cadastro) {
                const partes = trem.data_cadastro.split("-");
                data = partes[1] + "/" + partes[0];
            }

            linha.innerHTML = `
                <td>${data}</td>
                <td>${trem.numero_serie || "--"}</td>
                <td class="status-${trem.status}">
                    ${status}
                </td>
                <td>${trem.linha || "--"}</td>
                <td>${trem.modelo || "--"}</td>
            `;

            tabela.appendChild(linha);
        });

    } catch (erro) {
        console.error("Erro ao carregar estado da frota:", erro);

        document.getElementById("tabela-frota").innerHTML = `
            <tr>
                <td colspan="5">Erro ao carregar os dados.</td>
            </tr>
        `;
    }
}

carregarEstadoFrota();

async function carregarAlertas() {
    try {
        const resposta = await fetch("/ferrorama/backend/api/alertas.php");
        const dados = await resposta.json();

        const lista = document.getElementById("lista-alertas");

        lista.innerHTML = "";

        if (dados.length === 0) {
            lista.innerHTML = "<p>Nenhum alerta crítico.</p>";
            return;
        }

        dados.forEach(alerta => {

            const data = new Date(alerta.criado_em);

            const hora = data.toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit"
            });

            const item = document.createElement("div");

            item.className = "alerta-item";

            item.innerHTML = `
                <div class="icone-alerta">X</div>

                <div class="texto-alerta">
                    <strong>${alerta.titulo}</strong>
                    <span>${alerta.descricao}</span>
                </div>

                <span class="hora-alerta">${hora}</span>
            `;

            lista.appendChild(item);
        });

    } catch (erro) {

        console.error("Erro ao carregar alertas:", erro);

        document.getElementById("lista-alertas").innerHTML =
            "<p>Erro ao carregar os alertas.</p>";
    }
}

carregarAlertas();

async function carregarEventos() {
    try {
        const resposta = await fetch("/ferrorama/backend/api/eventos.php");
        const dados = await resposta.json();

        const lista = document.getElementById("lista-eventos");

        lista.innerHTML = "";

        if (!Array.isArray(dados) || dados.length === 0) {
            lista.innerHTML = "<p>Nenhum evento registrado.</p>";
            return;
        }

        dados.forEach(evento => {

            const data = new Date(evento.criado_em);

            const hora = data.toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit"
            });

            const item = document.createElement("div");

            item.className = "evento-item";

            item.innerHTML = `
                <div class="texto-evento">
                    <strong>${evento.titulo}</strong>
                    <span>${evento.descricao}</span>
                </div>

                <span class="hora-evento">${hora}</span>
            `;

            lista.appendChild(item);
        });

    } catch (erro) {

        console.error("Erro ao carregar eventos:", erro);

        document.getElementById("lista-eventos").innerHTML =
            "<p>Erro ao carregar os eventos.</p>";
    }
}

carregarEventos();