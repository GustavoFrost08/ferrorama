var campoInicio = document.getElementById("dataInicio");
var campoFim = document.getElementById("dataFim");
var filtroTremTopo = document.getElementById("filtroTremTopo");

var botaoModo = document.getElementById("btnModo");
var botaoGerar = document.getElementById("btnGerar");

var buscaSensor = document.getElementById("buscaSensor");
var filtroTipo = document.getElementById("filtroTipo");
var filtroTremTabela = document.getElementById("filtroTremTabela");
var filtroStatus = document.getElementById("filtroStatus");

var modal = document.getElementById("modalTrem");
var botaoFechar = document.getElementById("btnFechar");

var listaSensores = [];   
var graficoLinha = null;  
var graficoRosca = null;
var modoAdmin = true;     


if (typeof Chart != "undefined") {
    Chart.defaults.color = "#d9cdb8";
    Chart.defaults.borderColor = "rgba(163, 140, 122, 0.3)";
}

function limpar(texto) {
    texto = String(texto);
    texto = texto.replace(/&/g, "&amp;");
    texto = texto.replace(/</g, "&lt;");
    texto = texto.replace(/>/g, "&gt;");
    return texto;
}

function porcentagem(parte, total) {
    if (total == 0) {
        return "0,0%";
    }

    var valor = (parte / total) * 100;
    valor = valor.toFixed(1);
    return valor.replace(".", ",") + "%";
}

function nomeDoTipo(tipo) {
    if (tipo == "temperatura") return "Temperatura";
    if (tipo == "vibracao") return "Vibração";
    if (tipo == "velocidade") return "Velocidade";
    return "Pressão";
}

function nomeDoStatus(status) {
    if (status == "normal") return "Normal";
    if (status == "alerta") return "Alerta";
    return "Crítico";
}

function corDoStatus(status) {
    if (status == "normal") return "cor-verde";
    if (status == "alerta") return "cor-amarelo";
    return "cor-vermelho";
}

function colocarDataDeHoje() {
    var hoje = new Date();
    var ano = hoje.getFullYear();
    var mes = hoje.getMonth() + 1;
    var dia = hoje.getDate();

    if (mes < 10) mes = "0" + mes;
    if (dia < 10) dia = "0" + dia;

    campoFim.value = ano + "-" + mes + "-" + dia;
}

function carregarSensores() {
    fetch("../../backend/api/relatorio_sensores.php")
        .then(function (resposta) {
            return resposta.json();
        })
        .then(function (sensores) {

            if (sensores.erro) {
                alert("Erro do banco: " + sensores.erro);
                return;
            }

            listaSensores = sensores;
            preencherSelectsDeTrem();
            montarTabela();
            atualizarTudo();
        })
        .catch(function (erro) {
            alert("Não foi possível carregar os sensores: " + erro);
        });
}

function preencherSelectsDeTrem() {
    var idsVistos = [];
    var opcoes = "<option value='0'>Todos os trens</option>";

    for (var i = 0; i < listaSensores.length; i++) {
        var s = listaSensores[i];


        if (idsVistos.indexOf(s.trem_id) == -1) {
            idsVistos.push(s.trem_id);
            opcoes = opcoes + "<option value='" + s.trem_id + "'>" + limpar(s.trem) + "</option>";
        }
    }

    filtroTremTopo.innerHTML = opcoes;
    filtroTremTabela.innerHTML = opcoes;
}

function atualizarTudo() {
    preencherCards();
    carregarGrafico();
}

function sensoresDoTopo() {
    var lista = [];

    for (var i = 0; i < listaSensores.length; i++) {
        var s = listaSensores[i];

        if (filtroTremTopo.value == "0" || s.trem_id == filtroTremTopo.value) {
            lista.push(s);
        }
    }

    return lista;
}

function preencherCards() {
    var lista = sensoresDoTopo();
    var total = lista.length;
    var normais = 0;
    var alertas = 0;
    var criticos = 0;

    for (var i = 0; i < lista.length; i++) {
        if (lista[i].status == "normal") normais++;
        if (lista[i].status == "alerta") alertas++;
        if (lista[i].status == "critico") criticos++;
    }

    document.getElementById("cardTotal").textContent = total;
    document.getElementById("cardNormais").textContent = normais;
    document.getElementById("cardNormaisPct").textContent = porcentagem(normais, total) + " do total";
    document.getElementById("cardAlertas").textContent = alertas;
    document.getElementById("cardAlertasPct").textContent = porcentagem(alertas, total) + " do total";
    document.getElementById("cardCriticos").textContent = criticos;
    document.getElementById("cardCriticosPct").textContent = porcentagem(criticos, total) + " do total";

    desenharRosca(normais, alertas, criticos, total);
}

function desenharRosca(normais, alertas, criticos, total) {
    if (typeof Chart == "undefined") {
        return;
    }

    if (graficoRosca != null) {
        graficoRosca.destroy();
    }

    graficoRosca = new Chart(document.getElementById("graficoRosca"), {
        type: "doughnut",
        data: {
            labels: [
                "Normais " + porcentagem(normais, total),
                "Alertas " + porcentagem(alertas, total),
                "Críticos " + porcentagem(criticos, total)
            ],
            datasets: [{
                data: [normais, alertas, criticos],
                backgroundColor: ["#22c55e", "#ff8c00", "#d71a1a"],
                borderColor: "#4e321b"
            }]
        },
        options: {
            maintainAspectRatio: false,
            plugins: {
                legend: { position: "bottom" }
            }
        }
    });
}

function carregarGrafico() {
    var url = "../../backend/api/relatorio_ocorrencias.php" +
        "?inicio=" + campoInicio.value +
        "&fim=" + campoFim.value +
        "&trem=" + filtroTremTopo.value;

    fetch(url)
        .then(function (resposta) {
            return resposta.json();
        })
        .then(function (linhas) {
            if (linhas.erro) {
                alert("Erro do banco: " + linhas.erro);
                return;
            }

            desenharLinha(linhas);
        })
        .catch(function (erro) {
            alert("Não foi possível carregar as ocorrências: " + erro);
        });
}

function desenharLinha(linhas) {
    var aviso = document.getElementById("avisoLinha");

    if (graficoLinha != null) {
        graficoLinha.destroy();
        graficoLinha = null;
    }

    if (linhas.length == 0) {
        aviso.textContent = "Nenhuma ocorrência neste período.";
        return;
    }

    if (typeof Chart == "undefined") {
        aviso.textContent = "Não foi possível carregar a biblioteca de gráficos (verifique a internet).";
        return;
    }

    aviso.textContent = "";

    var dias = [];
    var trens = [];

    for (var i = 0; i < linhas.length; i++) {
        if (dias.indexOf(linhas[i].dia) == -1) {
            dias.push(linhas[i].dia);
        }
        if (trens.indexOf(linhas[i].trem) == -1) {
            trens.push(linhas[i].trem);
        }
    }

    var valores = {};

    for (var t = 0; t < trens.length; t++) {
        valores[trens[t]] = [];

        for (var d = 0; d < dias.length; d++) {
            valores[trens[t]].push(0);
        }
    }


    for (var j = 0; j < linhas.length; j++) {
        var posicaoDoDia = dias.indexOf(linhas[j].dia);
        valores[linhas[j].trem][posicaoDoDia] = Number(linhas[j].qtd);
    }


    var nomesDosDias = [];

    for (var k = 0; k < dias.length; k++) {
        var partes = dias[k].split("-");
        nomesDosDias.push(partes[2] + "/" + partes[1] + "/" + partes[0]);
    }

    var cores = ["#ff8c00", "#00e000", "#1677ff", "#e63946", "#b678ff", "#38bdf8"];
    var linhasDoGrafico = [];

    for (var n = 0; n < trens.length; n++) {
        linhasDoGrafico.push({
            label: trens[n],
            data: valores[trens[n]],
            borderColor: cores[n % cores.length],
            backgroundColor: cores[n % cores.length],
            tension: 0.4
        });
    }

    graficoLinha = new Chart(document.getElementById("graficoLinha"), {
        type: "line",
        data: {
            labels: nomesDosDias,
            datasets: linhasDoGrafico
        },
        options: {
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { precision: 0 }
                }
            }
        }
    });
}

function montarTabela() {
    var busca = buscaSensor.value.toLowerCase();
    var tipo = filtroTipo.value;
    var tremEscolhido = filtroTremTabela.value;
    var status = filtroStatus.value;

    var grupos = [];

    for (var i = 0; i < listaSensores.length; i++) {
        var s = listaSensores[i];

        var achouBusca = s.codigo.toLowerCase().indexOf(busca) != -1;
        var achouTipo = (tipo == "todos" || s.tipo == tipo);
        var achouTrem = (tremEscolhido == "0" || s.trem_id == tremEscolhido);
        var achouStatus = (status == "todos" || s.status == status);

        if (achouBusca && achouTipo && achouTrem && achouStatus) {

            var grupo = null;

            for (var g = 0; g < grupos.length; g++) {
                if (grupos[g].id == s.trem_id) {
                    grupo = grupos[g];
                }
            }

            if (grupo == null) {
                grupo = { id: s.trem_id, codigo: s.trem, total: 0, criticos: 0, alertas: 0, normais: 0 };
                grupos.push(grupo);
            }

            grupo.total++;
            if (s.status == "critico") grupo.criticos++;
            if (s.status == "alerta") grupo.alertas++;
            if (s.status == "normal") grupo.normais++;
        }
    }

    var html = "";

    if (grupos.length == 0) {
        html = "<tr><td colspan='7'>Nenhum sensor encontrado.</td></tr>";
    }

    for (var h = 0; h < grupos.length; h++) {
        var trem = grupos[h];

        var textoStatus = "NORMAL";
        var cor = "cor-verde";

        if (trem.criticos > 0) {
            textoStatus = "CRÍTICO";
            cor = "cor-vermelho";
        } else if (trem.alertas > 0) {
            textoStatus = "ATENÇÃO";
            cor = "cor-amarelo";
        }

        html = html + "<tr>";
        html = html + "<td>" + limpar(trem.codigo) + "</td>";
        html = html + "<td>" + trem.total + "</td>";
        html = html + "<td>" + trem.criticos + "</td>";
        html = html + "<td>" + trem.alertas + "</td>";
        html = html + "<td>" + trem.normais + "</td>";
        html = html + "<td class='texto_status " + cor + "'>" + textoStatus + "</td>";
        html = html + "<td><button class='btn_ver' onclick='verTrem(" + trem.id + ")'>ver</button></td>";
        html = html + "</tr>";
    }

    document.getElementById("tabelaRelatorio").innerHTML = html;
}

buscaSensor.addEventListener("input", montarTabela);
filtroTipo.addEventListener("change", montarTabela);
filtroTremTabela.addEventListener("change", montarTabela);
filtroStatus.addEventListener("change", montarTabela);

campoInicio.addEventListener("change", atualizarTudo);
campoFim.addEventListener("change", atualizarTudo);
filtroTremTopo.addEventListener("change", atualizarTudo);

function verTrem(idDoTrem) {
    var html = "";
    var codigoDoTrem = "";

    for (var i = 0; i < listaSensores.length; i++) {
        var s = listaSensores[i];

        if (s.trem_id == idDoTrem) {
            codigoDoTrem = s.trem;

            var leitura = "-";
            if (s.ultima_leitura != null) {
                leitura = s.ultima_leitura;
                if (s.unidade != null) {
                    leitura = leitura + " " + s.unidade;
                }
            }

            html = html + "<tr>";
            html = html + "<td>" + limpar(s.codigo) + "</td>";
            html = html + "<td>" + nomeDoTipo(s.tipo) + "</td>";
            html = html + "<td>" + limpar(leitura) + "</td>";
            html = html + "<td class='texto_status " + corDoStatus(s.status) + "'>" + nomeDoStatus(s.status) + "</td>";
            html = html + "</tr>";
        }
    }

    document.getElementById("tituloModal").textContent = "Sensores do " + codigoDoTrem;
    document.getElementById("tabelaModal").innerHTML = html;
    modal.classList.add("aberto");
}

function fecharModal() {
    modal.classList.remove("aberto");
}

botaoFechar.addEventListener("click", fecharModal);

modal.addEventListener("click", function (evento) {
    if (evento.target == modal) {
        fecharModal();
    }
});



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

function gerarRelatorio() {
    if (modoAdmin == false) {
        return; 
    }

    window.print();
}

botaoGerar.addEventListener("click", gerarRelatorio);

colocarDataDeHoje();
carregarSensores();