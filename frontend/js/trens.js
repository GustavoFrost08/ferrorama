async function carregarTrens() {

    const resposta = await fetch("/backend/trens.php");

    const trens = await resposta.json();


    // =========================
    // CONTADORES
    // =========================

    let ativos = 0;
    let manutencao = 0;
    let parados = 0;


    trens.forEach(trem => {

        if (trem.status === "em_operacao") {
            ativos++;
        }

        if (trem.status === "em_manutencao") {
            manutencao++;
        }

        if (trem.status === "parado") {
            parados++;
        }

    });


    document.getElementById("ativos").textContent = ativos;

    document.getElementById("manutencao").textContent = manutencao;

    document.getElementById("parados").textContent = parados;


    // =========================
    // TABELA
    // =========================

    const tabela = document.getElementById("tabelaTrens");

    tabela.innerHTML = "";


    trens.forEach(trem => {

        const linha = document.createElement("tr");


        linha.innerHTML = `

            <td>${trem.codigo}</td>

            <td>${formatarStatus(trem.status)}</td>

            <td>
                ${trem.linha} - ${trem.localizacao_atual}
            </td>

            <td>
                ${trem.velocidade_atual} km/h
            </td>

        `;


        // Clicar no trem
        linha.addEventListener("click", function() {

            document.getElementById("detalhesTrem").innerHTML = `

                <strong>${trem.codigo}</strong><br><br>

                Status: ${formatarStatus(trem.status)}<br>

                Linha: ${trem.linha}<br>

                Localização: ${trem.localizacao_atual}<br>

                Velocidade: ${trem.velocidade_atual} km/h

            `;

        });


        tabela.appendChild(linha);

    });

}


/* =========================
   TRANSFORMAR STATUS
========================= */

function formatarStatus(status) {

    if (status === "em_operacao") {
        return "Em operação";
    }

    if (status === "em_manutencao") {
        return "Em manutenção";
    }

    if (status === "parado") {
        return "Parado";
    }

    if (status === "alerta_tecnico") {
        return "Alerta técnico";
    }

    if (status === "inspecao") {
        return "Inspeção";
    }

    if (status === "fora_de_uso") {
        return "Fora de uso";
    }

    return status;
}


/* =========================
   INICIAR
========================= */

carregarTrens();