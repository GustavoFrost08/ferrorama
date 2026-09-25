// ===============================
// DADOS DA TELA DE RELATÓRIOS.js
// ===============================

fetch("../php/relatorios.php")
    .then(response => {
        if (!response.ok) {
            throw new Error("Erro ao buscar dados do PHP");
        }
        return response.json();
    })
    .then(dados => {
        console.log(dados);

        console.log("Total de sensores:", dados.totalSensores);
        console.log("Sensores normais:", dados.sensoresNormais);
        console.log("Sensores em alerta:", dados.sensoresAlerta);
        console.log("Sensores críticos:", dados.sensoresCriticos);

        console.log("Trens:", dados.trens);
    })
    .catch(erro => {
        console.error("Erro na comunicação com PHP:", erro);
    });
    
    trens: [
        {
            codigo: "TR-001",
            sensores: 32,
            criticos: 8,
            alertas: 6,
            normais: 18,
            status: "ATENÇÃO"
        },
        {
            codigo: "TR-002",
            sensores: 28,
            criticos: 2,
            alertas: 4,
            normais: 22,
            status: "NORMAL"
        },
        {
            codigo: "TR-003",
            sensores: 36,
            criticos: 8,
            alertas: 9,
            normais: 19,
            status: "CRÍTICO"
        }
    ],

    grafico: {
        trem01: [8, 10, 12, 18, 9, 11, 8, 15, 17, 9, 14, 12],
        trem02: [2, 3, 5, 4, 5, 3, 4, 6, 5, 3, 5, 4],
        trem03: [4, 6, 10, 7, 6, 7, 11, 8, 10, 6, 8, 11]
    }
};

// ===============================
// CARDS SUPERIORES
// ===============================

const cards = document.querySelectorAll(".linha_cima .frota");

if (cards.length >= 4) {

    cards[0].innerHTML = `
        <div class="img_status sensor-icon">🚆</div>
        <div class="text_frota">
            <span>Total de sensores</span>
            <strong>${dados.totalSensores}</strong>
            <small>Cadastrados</small>
        </div>
    `;

    cards[1].innerHTML = `
        <div class="img_status status-normal">✓</div>
        <div class="text_frota">
            <span>Sensores normais</span>
            <strong>${dados.sensoresNormais}</strong>
            <small>85,9% do total</small>
        </div>
    `;

    cards[2].innerHTML = `
        <div class="img_status status-alerta">!</div>
        <div class="text_frota">
            <span>Sensores em alerta</span>
            <strong>${dados.sensoresAlerta}</strong>
            <small>9,4% do total</small>
        </div>
    `;

    cards[3].innerHTML = `
        <div class="img_status status-critico">×</div>
        <div class="text_frota">
            <span>Sensores críticos</span>
            <strong>${dados.sensoresCriticos}</strong>
            <small>4,7% do total</small>
        </div>
    `;
}

// ===============================
// GRÁFICO DE LINHA
// ===============================

const areaGrafico = document.querySelector(".area_grafico_linha");

if (areaGrafico) {

    areaGrafico.innerHTML = `
        <div class="grafico_legenda">
            <span><i class="leg trem01"></i> Trem 01</span>
            <span><i class="leg trem02"></i> Trem 02</span>
            <span><i class="leg trem03"></i> Trem 03</span>
        </div>

        <canvas id="graficoOcorrencias"></canvas>
    `;

    const canvas = document.getElementById("graficoOcorrencias");
    const ctx = canvas.getContext("2d");

    canvas.width = areaGrafico.clientWidth;
    canvas.height = 190;

    const largura = canvas.width;
    const altura = canvas.height;

    const margemEsq = 35;
    const margemBaixo = 25;
    const margemTopo = 10;
    const margemDir = 10;

    const larguraGrafico =
        largura - margemEsq - margemDir;

    const alturaGrafico =
        altura - margemTopo - margemBaixo;

    const maiorValor = 20;

    // ===============================
    // LINHAS HORIZONTAIS
    // ===============================

    ctx.strokeStyle = "rgba(255,255,255,0.10)";
    ctx.lineWidth = 1;

    for (let i = 0; i <= 4; i++) {

        const y =
            margemTopo +
            (alturaGrafico / 4) * i;

        ctx.beginPath();
        ctx.moveTo(margemEsq, y);
        ctx.lineTo(largura - margemDir, y);
        ctx.stroke();

        ctx.fillStyle = "#d8c0b0";
        ctx.font = "9px Arial";

        ctx.fillText(
            20 - (i * 5),
            5,
            y + 3
        );
    }

    // ===============================
    // FUNÇÃO PARA DESENHAR LINHAS
    // ===============================

    function desenharLinha(valores, cor) {

        ctx.beginPath();

        valores.forEach((valor, index) => {

            const x =
                margemEsq +
                (larguraGrafico / (valores.length - 1)) * index;

            const y =
                margemTopo +
                alturaGrafico -
                (valor / maiorValor) * alturaGrafico;

            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });

        ctx.strokeStyle = cor;
        ctx.lineWidth = 2;
        ctx.stroke();

        // pontos da linha
        valores.forEach((valor, index) => {

            const x =
                margemEsq +
                (larguraGrafico / (valores.length - 1)) * index;

            const y =
                margemTopo +
                alturaGrafico -
                (valor / maiorValor) * alturaGrafico;

            ctx.beginPath();
            ctx.arc(x, y, 2.5, 0, Math.PI * 2);

            ctx.fillStyle = cor;
            ctx.fill();
        });
    }

    // ===============================
    // DESENHA AS 3 LINHAS
    // ===============================

    desenharLinha(
        dados.grafico.trem01,
        "#f97316"
    );

    desenharLinha(
        dados.grafico.trem02,
        "#22c55e"
    );

    desenharLinha(
        dados.grafico.trem03,
        "#3b82f6"
    );

    // ===============================
    // DATAS
    // ===============================

    const datas = [
        "01 mai. 2026",
        "02 mai. 2026",
        "03 mai. 2026",
        "04 mai. 2026",
        "05 mai. 2026",
        "06 mai. 2026",
        "07 mai. 2026",
        "08 mai. 2026",
        "09 mai. 2026",
        "10 mai. 2026",
        "11 mai. 2026",
        "12 mai. 2026"
    ];

    ctx.fillStyle = "#d8c0b0";
    ctx.font = "8px Arial";

    datas.forEach((data, index) => {

        const x =
            margemEsq +
            (larguraGrafico / (datas.length - 1)) * index;

        ctx.fillText(
            data,
            x - 25,
            altura - 5
        );
    });
}

// ===============================
// GRÁFICO DE ROSCA
// ===============================

const areaRosca = document.querySelector(".area_grafico_rosca");

if (areaRosca) {

    areaRosca.innerHTML = `
        <div class="rosca-container">

            <div class="rosca">
                <div class="rosca-centro"></div>
            </div>

            <div class="rosca-legenda">

                <div>
                    <span class="quadrado critico"></span>
                    Críticas
                    <strong>45%</strong>
                </div>

                <div>
                    <span class="quadrado alerta"></span>
                    Alertas
                    <strong>30%</strong>
                </div>

                <div>
                    <span class="quadrado normal"></span>
                    Normais
                    <strong>25%</strong>
                </div>

            </div>

        </div>
    `;
}

// ===============================
// TABELA
// ===============================

const tabela = document.querySelector(".box_tabela table");

if (tabela) {

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

        <tbody>

            ${dados.trens.map(trem => `

                <tr>

                    <td>
                        <span class="icone-trem">♙</span>
                        ${trem.codigo.replace("-", " ")}
                    </td>

                    <td>
                        ${trem.sensores}
                    </td>

                    <td>
                        ${trem.criticos}
                    </td>

                    <td>
                        ${trem.alertas}
                    </td>

                    <td>
                        ${trem.normais}
                    </td>

                    <td>
                        ${trem.sensores}
                    </td>

                    <td>

                        <span class="status-tabela ${trem.status.toLowerCase()}">
                            ${trem.status}
                        </span>

                        <button class="btn-ver">
                            ver
                        </button>

                    </td>

                </tr>

            `).join("")}

        </tbody>
    `;
}

// ===============================
// BOTÃO GERAR RELATÓRIO
// ===============================

const botaoRelatorio = document.querySelector(".btn_gerar_relatorio");

if (botaoRelatorio) {

    botaoRelatorio.addEventListener("click", function () {

        alert("Relatório gerado com sucesso!");
    });
}