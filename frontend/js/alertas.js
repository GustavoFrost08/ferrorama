async function carregarAlertas(filtro = "todos") {

    try {

        const resposta = await fetch("/ferrorama/backend/api/todos_alertas.php");

        const dados = await resposta.json();

        const lista = document.getElementById("lista-alertas");

        lista.innerHTML = "";

        let alertas = dados;

        if (filtro !== "todos") {
            alertas = dados.filter(alerta => alerta.gravidade === filtro);
        }

        if (alertas.length === 0) {
            lista.innerHTML = "<p>Nenhum alerta encontrado.</p>";
            return;
        }

        alertas.forEach(alerta => {

            const item = document.createElement("div");

            item.className = "alerta-card";

            const classe = alerta.gravidade === "critico"
                ? "critico"
                : "alerta";

            const textoGravidade = alerta.gravidade === "critico"
                ? "CRÍTICO"
                : "ALERTA";

            const data = new Date(alerta.criado_em);

            const dataFormatada = data.toLocaleDateString("pt-BR");

            const hora = data.toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit"
            });

            item.innerHTML = `
                <div class="icone ${classe}">
                    !
                </div>

                <div class="informacoes">
                    <div class="titulo">
                        <strong>${alerta.titulo}</strong>
                        <span class="gravidade ${classe}">
                            ${textoGravidade}
                        </span>
                    </div>

                    <p>${alerta.descricao || "Sem descrição"}</p>

                    <small>
                        ${dataFormatada} às ${hora}
                    </small>
                </div>
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