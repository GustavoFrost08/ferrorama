// =====================================================
// TELA DE RELATÓRIOS - TrainFerro (dados reais do banco)
// =====================================================

const API = "/ferrorama/backend/api/relatorios.php";
const INTERVALO_ATUALIZACAO = 10000;   // 10 segundos
const COR_TEXTO = "#d8c0b0";
const CORES_TRENS = ["#f97316", "#22c55e", "#3b82f6", "#a855f7", "#eab308"];
const MESES = ["jan.", "fev.", "mar.", "abr.", "mai.", "jun.", "jul.", "ago.", "set.", "out.", "nov.", "dez."];

// ---------- elementos da página ----------
const inputInicio = document.getElementById("dataInicio");
const inputFim = document.getElementById("dataFim");
const selectTrem = document.getElementById("filtroTrem");
const buscaTabela = document.getElementById("buscaTabela");
const tabelaTrem = document.getElementById("tabelaFiltroTrem");
const tabelaStatus = document.getElementById("tabelaFiltroStatus");

// indicador "ao vivo" ao lado dos filtros
const indicador = document.createElement("span");
indicador.style.cssText = "margin-left:auto;align-self:center;font-size:0.7rem;color:#d8c0b0;opacity:0.85";
document.querySelector(".filtros_topo").appendChild(indicador);

// ---------- período padrão: últimos 12 dias (até hoje) ----------
function iso(data) {
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const dia = String(data.getDate()).padStart(2, "0");
    return `${data.getFullYear()}-${mes}-${dia}`;
}

const hoje = new Date();
const inicioPadrao = new Date();
inicioPadrao.setDate(hoje.getDate() - 11);
inputInicio.value = iso(inicioPadrao);
inputFim.value = iso(hoje);

// ---------- estado ----------
let dados = null;
let graficoLinha = null;
let graficoRosca = null;
let selectsPreenchidos = false;
let ultimaRequisicao = 0;

// =====================================================
// BUSCA OS DADOS NO PHP
// =====================================================
async function carregar() {
    if (!inputInicio.value || !inputFim.value) return;

    const minhaRequisicao = ++ultimaRequisicao;
    const params = new URLSearchParams({
        inicio: inputInicio.value,
        fim: inputFim.value,
        trem: selectTrem.value
    });

    try {
        const resposta = await fetch(`${API}?${params}`, { cache: "no-store" });
        const texto = await resposta.text();

        if (!resposta.ok) {
            throw new Error("HTTP " + resposta.status + " ao abrir " + resposta.url + " | " + texto.slice(0, 200));
        }

        let novos;
        try {
            novos = JSON.parse(texto);
        } catch (e) {
            throw new Error("A resposta do PHP não é JSON. Ela começa com: " + texto.slice(0, 200));
        }

        // se chegou uma resposta mais antiga que outra já pedida, ignora
        if (minhaRequisicao !== ultimaRequisicao) return;

        dados = novos;
        indicador.textContent = "● Ao vivo · atualizado às " + dados.atualizadoEm;
        indicador.style.color = "#22c55e";

        // cada parte é desenhada separadamente: um erro não derruba as outras
        executar(preencherSelects);
        executar(desenharCards);
        executar(desenharLinha);
        executar(desenharRosca);
        executar(desenharTabela);

    } catch (erro) {
        console.error("Erro ao carregar dados:", erro);
        indicador.textContent = "● Sem conexão com o servidor";
        indicador.style.color = "#e00000";

        if (!dados) {
            document.querySelector(".box_tabela table").innerHTML =
                `<tbody><tr><td colspan="7" id="msgErro" style="text-align:center;white-space:pre-wrap"></td></tr></tbody>`;
            document.getElementById("msgErro").textContent =
                "Não foi possível carregar os dados.\nMotivo: " + erro.message +
                "\nPágina aberta em: " + location.href;
        }
    }
}

function executar(funcao) {
    try {
        funcao();
    } catch (erro) {
        console.error("Erro em " + funcao.name + ":", erro);
    }
}

// "TR-001" -> "Trem 01"
function nomeTrem(codigo) {
    const numero = parseInt(String(codigo).replace(/\D/g, ""), 10);
    return "Trem " + String(isNaN(numero) ? codigo : numero).padStart(2, "0");
}

// =====================================================
// SELECTS DE TREM (preenchidos uma vez, com os trens do banco)
// =====================================================
function preencherSelects() {
    if (selectsPreenchidos) return;
    selectsPreenchidos = true;

    const opcoes = dados.trensLista
        .map(t => `<option value="${t.id}">${nomeTrem(t.codigo)}</option>`)
        .join("");

    selectTrem.innerHTML = `<option value="todos">Todos os trens</option>${opcoes}`;
    tabelaTrem.innerHTML = `<option value="todos">Todos os trens</option>${opcoes}`;
}

// =====================================================
// CARDS
// =====================================================
function pct(parte, total) {
    return total ? ((parte / total) * 100).toFixed(1).replace(".", ",") : "0,0";
}

function desenharCards() {
    const cards = document.querySelectorAll(".linha_cima .frota");
    const d = dados;

    const lista = [
        { icone: "🚆", classe: "sensor-icon",    titulo: "Total de sensores",  valor: d.totalSensores,    legenda: "Cadastrados" },
        { icone: "✓",  classe: "status-normal",  titulo: "Sensores normais",   valor: d.sensoresNormais,  legenda: pct(d.sensoresNormais, d.totalSensores) + "% do total" },
        { icone: "!",  classe: "status-alerta",  titulo: "Sensores em alerta", valor: d.sensoresAlerta,   legenda: pct(d.sensoresAlerta, d.totalSensores) + "% do total" },
        { icone: "×",  classe: "status-critico", titulo: "Sensores críticos",  valor: d.sensoresCriticos, legenda: pct(d.sensoresCriticos, d.totalSensores) + "% do total" }
    ];

    lista.forEach((item, i) => {
        if (!cards[i]) return;
        cards[i].innerHTML = `
            <div class="img_status ${item.classe}">${item.icone}</div>
            <div class="text_frota">
                <span>${item.titulo}</span>
                <strong>${item.valor}</strong>
                <small>${item.legenda}</small>
            </div>`;
    });
}

// =====================================================
// GRÁFICO DE LINHA
// =====================================================
function formatarData(isoData) {
    // "2026-05-01" -> "01 mai. 2026"
    return `${isoData.slice(8, 10)} ${MESES[Number(isoData.slice(5, 7)) - 1]} ${isoData.slice(0, 4)}`;
}

function desenharLinha() {
    if (typeof Chart === "undefined") {
        console.error("Chart.js não carregou (verifique a internet e o <script> no HTML)");
        return;
    }

    const g = dados.grafico;
    const labels = g.labels.map(formatarData);

    const datasets = g.series.map((serie, i) => ({
        label: nomeTrem(serie.trem),
        data: serie.valores,
        borderColor: CORES_TRENS[i % CORES_TRENS.length],
        backgroundColor: CORES_TRENS[i % CORES_TRENS.length],
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 3
    }));

    // já existe: só atualiza os dados (sem piscar)
    if (graficoLinha) {
        graficoLinha.data.labels = labels;
        graficoLinha.data.datasets = datasets;
        graficoLinha.update();
        return;
    }

    const ctx = document.getElementById("graficoOcorrencias").getContext("2d");
    graficoLinha = new Chart(ctx, {
        type: "line",
        data: { labels: labels, datasets: datasets },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { mode: "index", intersect: false },
            plugins: {
                legend: {
                    position: "top",
                    labels: { color: COR_TEXTO, usePointStyle: true, boxWidth: 6, font: { size: 10 } }
                }
            },
            scales: {
                x: { ticks: { color: COR_TEXTO, font: { size: 9 } }, grid: { display: false } },
                y: {
                    beginAtZero: true,
                    ticks: { color: COR_TEXTO, font: { size: 9 }, precision: 0 },
                    grid: { color: "rgba(255,255,255,0.10)" }
                }
            }
        }
    });
}

// =====================================================
// GRÁFICO DE ROSCA
// =====================================================
function desenharRosca() {
    if (typeof Chart === "undefined") return;

    const t = dados.tipos;
    const soma = t.critico + t.alerta + t.normal;
    const p = v => Math.round((v / soma) * 100);
    const vazio = soma === 0;

    const labels = vazio
        ? ["Sem ocorrências"]
        : [`Críticas ${p(t.critico)}%`, `Alertas ${p(t.alerta)}%`, `Normais ${p(t.normal)}%`];
    const valores = vazio ? [1] : [t.critico, t.alerta, t.normal];
    const cores = vazio ? ["#5a4535"] : ["#e00000", "#ff8c00", "#299b18"];

    if (graficoRosca) {
        graficoRosca.data.labels = labels;
        graficoRosca.data.datasets[0].data = valores;
        graficoRosca.data.datasets[0].backgroundColor = cores;
        graficoRosca.options.plugins.tooltip.enabled = !vazio;
        graficoRosca.update();
        return;
    }

    const ctx = document.getElementById("graficoRosca").getContext("2d");
    graficoRosca = new Chart(ctx, {
        type: "doughnut",
        data: {
            labels: labels,
            datasets: [{ data: valores, backgroundColor: cores, borderWidth: 0 }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: "55%",
            plugins: {
                tooltip: { enabled: !vazio },
                legend: { position: "right", labels: { color: COR_TEXTO, boxWidth: 10, font: { size: 10 } } }
            }
        }
    });
}

// =====================================================
// TABELA
// =====================================================
function slug(texto) {
    // "CRÍTICO" -> "critico", "ATENÇÃO" -> "atencao"
    return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function desenharTabela() {
    const tabela = document.querySelector(".box_tabela table");
    const termo = buscaTabela.value.trim().toLowerCase();

    const linhas = dados.trens.filter(t =>
        (tabelaTrem.value === "todos" || String(t.id) === tabelaTrem.value) &&
        (tabelaStatus.value === "todos" || slug(t.status) === tabelaStatus.value) &&
        (termo === "" || t.codigo.toLowerCase().includes(termo) || nomeTrem(t.codigo).toLowerCase().includes(termo))
    );

    const corpo = linhas.length === 0
        ? `<tr><td colspan="7" style="text-align:center">Nenhum resultado</td></tr>`
        : linhas.map(t => `
            <tr>
                <td><span class="icone-trem">🚆</span>${nomeTrem(t.codigo).toUpperCase()}</td>
                <td>${t.sensores}</td>
                <td>${t.criticos}</td>
                <td>${t.alertas}</td>
                <td>${t.normais}</td>
                <td>${t.sensores}</td>
                <td>
                    <span class="status-tabela ${slug(t.status)}">${t.status}</span>
                    <button class="btn-ver" data-id="${t.id}">ver</button>
                </td>
            </tr>`).join("");

    tabela.innerHTML = `
        <thead>
            <tr>
                <th>TREM</th>
                <th>SENSORES</th>
                <th>OCORRÊNCIAS CRÍTICAS</th>
                <th>ALERTAS</th>
                <th>NORMAIS</th>
                <th>TOTAL</th>
                <th>STATUS</th>
            </tr>
        </thead>
        <tbody>${corpo}</tbody>`;
}

// =====================================================
// EVENTOS
// =====================================================
// filtros de cima -> buscam dados de novo
[inputInicio, inputFim, selectTrem].forEach(el => el.addEventListener("change", carregar));

// filtros da tabela -> só redesenham a tabela
buscaTabela.addEventListener("input", () => dados && executar(desenharTabela));
tabelaTrem.addEventListener("change", () => dados && executar(desenharTabela));
tabelaStatus.addEventListener("change", () => dados && executar(desenharTabela));

// botão "ver"
document.querySelector(".box_tabela").addEventListener("click", e => {
    if (e.target.classList.contains("btn-ver")) {
        window.location.href = `../html/sensores.html?trem=${e.target.dataset.id}`;
    }
});

// botão "gerar relatório" -> baixa CSV (abre no Excel)
document.querySelector(".btn_gerar_relatorio").addEventListener("click", () => {
    if (!dados) return;

    const linhas = [
        ["Trem", "Sensores", "Críticos", "Alertas", "Normais", "Total", "Status"],
        ...dados.trens.map(t => [t.codigo, t.sensores, t.criticos, t.alertas, t.normais, t.sensores, t.status])
    ];

    const csv = "\uFEFF" + linhas.map(l => l.join(";")).join("\n");
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
    link.download = `relatorio_${inputInicio.value}_a_${inputFim.value}.csv`;
    link.click();
});

// =====================================================
// INÍCIO + ATUALIZAÇÃO AUTOMÁTICA (tempo real)
// =====================================================
carregar();
setInterval(() => {
    if (!document.hidden) carregar();   // não atualiza se a aba estiver em segundo plano
}, INTERVALO_ATUALIZACAO);