// ===== Pegando os elementos da página =====
var botaoModo = document.getElementById("btnModo");
var botaoNovo = document.getElementById("btnNovoSensor");

var modal = document.getElementById("modalSensor");
var botaoFecharModal = document.getElementById("btnFecharModal");
var formulario = document.getElementById("formSensor");

var campoTipo = document.getElementById("campoTipo");
var campoTrem = document.getElementById("campoTrem");
var textoUnidade = document.getElementById("textoUnidade");

var modoAdmin = true;

function trocarModo() {
    modoAdmin = !modoAdmin;

    if (modoAdmin) {
        document.body.classList.remove("modo_usuario");
        botaoModo.textContent = "Visualizando como: Administrador";
    } else {
        document.body.classList.add("modo_usuario");
        botaoModo.textContent = "Visualizando como: Usuário";
    }
}

botaoModo.addEventListener("click", trocarModo);

function atualizarUnidade() {
    var tipo = campoTipo.value;

    if (tipo == "temperatura") {
        textoUnidade.textContent = "Unidade: °C";
    } else if (tipo == "vibracao") {
        textoUnidade.textContent = "Unidade: mm/s";
    } else if (tipo == "velocidade") {
        textoUnidade.textContent = "Unidade: km/h";
    } else if (tipo == "pressao") {
        textoUnidade.textContent = "Unidade: bar";
    } else {
        textoUnidade.textContent = "";
    }
}

campoTipo.addEventListener("change", atualizarUnidade);

function carregarTrensDoFormulario() {
    fetch("/ferrorama/backend/api/trens.php")
        .then(function (resposta) {
            return resposta.json();
        })
        .then(function (trens) {
            if (trens.erro) {
                alert("Erro do banco: " + trens.erro);
                return;
            }

            var opcoes = "<option value=''>Selecionar...</option>";

            for (var i = 0; i < trens.length; i++) {
                opcoes = opcoes + "<option value='" + trens[i].id + "'>" + trens[i].codigo + "</option>";
            }

            campoTrem.innerHTML = opcoes;
        })
        .catch(function (erro) {
            alert("Não foi possível carregar os trens: " + erro);
        });
}

function abrirModal() {
    if (modoAdmin == false) {
        return; 
    }

    formulario.reset();
    atualizarUnidade();
    carregarTrensDoFormulario();

    modal.classList.add("aberto");
}

function fecharModal() {
    modal.classList.remove("aberto");
}

botaoNovo.addEventListener("click", abrirModal);
botaoFecharModal.addEventListener("click", fecharModal);

modal.addEventListener("click", function (evento) {
    if (evento.target == modal) {
        fecharModal();
    }
});

formulario.addEventListener("submit", function (evento) {
    evento.preventDefault();

    var dados = new FormData(formulario);

    fetch("/ferrorama/backend/api/adicionar_sensor.php", {
        method: "POST",
        body: dados
    })
        .then(function (resposta) {
            return resposta.json();
        })
        .then(function (resultado) {
            if (resultado.sucesso) {
                alert("Sensor cadastrado com sucesso!");
                formulario.reset();
                fecharModal();

                carregarSensores();
            } else {
                alert("Erro: " + (resultado.erro || "tente novamente"));
            }
        })
        .catch(function (erro) {
            alert("Não foi possível falar com o servidor: " + erro);
        });
});