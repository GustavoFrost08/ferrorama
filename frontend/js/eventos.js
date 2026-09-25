async function carregarTodosEventos() {

    try {

        const resposta = await fetch(
            "/ferrorama/backend/api/todos_eventos.php"
        );

        const dados = await resposta.json();

        const lista = document.getElementById("todos-eventos");

        lista.innerHTML = "";

        if (!Array.isArray(dados) || dados.length === 0) {

            lista.innerHTML =
                "<p>Nenhum evento registrado.</p>";

            return;
        }

        dados.forEach(evento => {

            const data = new Date(evento.criado_em);

            const dataFormatada =
                data.toLocaleDateString("pt-BR");

            const hora =
                data.toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit"
                });

            const item =
                document.createElement("div");

            item.className = "evento-completo";

            item.innerHTML = `
                <strong>${evento.titulo}</strong>

                <span>
                    ${evento.descricao || ""}
                </span>

                <span class="evento-data">
                    Trem: ${evento.trem || "Não informado"}
                    &nbsp; | &nbsp;
                    ${dataFormatada} às ${hora}
                </span>
            `;

            lista.appendChild(item);

        });

    } catch (erro) {

        console.error(
            "Erro ao carregar eventos:",
            erro
        );

        document.getElementById(
            "todos-eventos"
        ).innerHTML =
            "<p>Erro ao carregar os eventos.</p>";
    }
}

carregarTodosEventos();