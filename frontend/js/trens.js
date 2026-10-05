// ===== Pegando os elementos da página =====
var modal = document.getElementById("modalTrem");
var botaoAbrir = document.getElementById("btnAbrir");
var botaoFechar = document.getElementById("btnFechar");
var formulario = document.getElementById("formTrem");

// guarda os trens que vieram do banco
var listaTrens = [];

// ===== Abrir e fechar a janela =====
function abrirModal() {
    modal.classList.add("aberto");
}

function fecharModal() {
    modal.classList.remove("aberto");
}

botaoAbrir.addEventListener("click", abrirModal);
botaoFechar.addEventListener("click", fecharModal);

// clicar no fundo escuro (fora da caixa) também fecha
modal.addEventListener("click", function (evento) {
    if (evento.target == modal) {
        fecharModal();
    }
});

// ===== Enviar o formulário para o PHP =====
formulario.addEventListener("submit", function (evento) {
    // impede a página de recarregar
    evento.preventDefault();

    // junta todos os campos (usa o "name" de cada um)
    var dados = new FormData(formulario);

    fetch("../../backend/api/adicionar_trem.php", {
        method: "POST",
        body: dados
    })
        .then(function (resposta) {
            return resposta.json();
        })
        .then(function (resultado) {
            if (resultado.sucesso) {
                alert("Trem cadastrado com sucesso!");
                formulario.reset();
                fecharModal();
                carregarTrens();
                carregarHistorico();
            } else {
                alert("Erro: " + (resultado.erro || "tente novamente"));
            }
        })
        .catch(function () {
            alert("Não foi possível falar com o servidor. Veja o Console (F12).");
        });
});

// ===== Buscar os trens no banco e mostrar na tabela =====
function carregarTrens() {
    fetch("../../backend/api/trens.php")
        .then(function (resposta) {
            return resposta.json();
        })
        .then(function (trens) {
            // se o PHP mandou um erro, mostra e para
            if (trens.erro) {
                alert("Erro do banco: " + trens.erro);
                return;
            }

            listaTrens = trens;
            montarTabela();
            contarStatus();
        })
        .catch(function () {
            alert("Não foi possível carregar os trens. Veja o Console (F12).");
        });
}

function nomeDoStatus(status) {
    if (status == "em_operacao") return "Em operação";
    if (status == "em_manutencao") return "Em manutenção";
    if (status == "parado") return "Parado";
    if (status == "alerta_tecnico") return "Alerta técnico";
    if (status == "inspecao") return "Inspeção";
    return "Fora de uso";
}

function montarTabela() {
    var tabela = document.getElementById("tabelaTrens");
    var html = "";

    for (var i = 0; i < listaTrens.length; i++) {
        var trem = listaTrens[i];

        html = html + "<tr onclick='mostrarDetalhes(" + i + ")'>";
        html = html + "<td>" + trem.codigo + "</td>";
        html = html + "<td class='status-" + trem.status + "'>" + nomeDoStatus(trem.status) + "</td>";
        html = html + "<td>" + trem.localizacao_atual + "</td>";
        html = html + "<td>" + trem.velocidade_atual + " km/h</td>";
        html = html + "</tr>";
    }

    tabela.innerHTML = html;
}

function contarStatus() {
    var ativos = 0;
    var manutencao = 0;
    var parados = 0;

    for (var i = 0; i < listaTrens.length; i++) {
        if (listaTrens[i].status == "em_operacao") ativos++;
        if (listaTrens[i].status == "em_manutencao") manutencao++;
        if (listaTrens[i].status == "parado") parados++;
    }

    document.getElementById("ativos").textContent = ativos;
    document.getElementById("manutencao").textContent = manutencao;
    document.getElementById("parados").textContent = parados;
}

// ===== Mostrar detalhes do trem clicado =====
function mostrarDetalhes(posicao) {
    var trem = listaTrens[posicao];

    document.getElementById("detalhesTrem").innerHTML =
        "<strong>" + trem.codigo + "</strong><br>" +
        "Modelo: " + trem.modelo + "<br>" +
        "Nº de série: " + trem.numero_serie + "<br>" +
        "Linha: " + trem.linha + "<br>" +
        "Cadastro: " + trem.data_cadastro;
}

// ===== Mostrar o histórico recente (eventos do banco) =====
function carregarHistorico() {
    fetch("../../backend/api/historico.php")
        .then(function (resposta) {
            return resposta.json();
        })
        .then(function (eventos) {
            if (eventos.erro) {
                alert("Erro no histórico: " + eventos.erro);
                return;
            }

            var lista = document.getElementById("lista-eventos");
            var html = "";

            for (var i = 0; i < eventos.length; i++) {
                var evento = eventos[i];

                html = html + "<div class='evento-item'>";
                html = html + "<div class='texto-evento'>";
                html = html + "<strong>" + evento.titulo + "</strong>";
                html = html + "<span>" + evento.descricao + "</span>";
                html = html + "</div>";
                html = html + "<span class='hora-evento'>" + evento.hora + "</span>";
                html = html + "</div>";
            }

            lista.innerHTML = html;
        })
        .catch(function () {
            alert("Não foi possível carregar o histórico. Veja o Console (F12).");
        });
}
// roda assim que a página abre
carregarTrens();
carregarHistorico();