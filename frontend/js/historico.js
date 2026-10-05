
function carregarHistorico() {
    fetch("../../backend/api/historico_completo.php")
        .then(function (resposta) {
            return resposta.json();
        })
        .then(function (eventos) {

            if (eventos.erro) {
                alert("Erro no histórico: " + eventos.erro);
                return;
            }

            var lista = document.getElementById("lista-historico");

            if (eventos.length == 0) {
                lista.innerHTML = "<p class='hist_vazio'>Nenhum evento registrado.</p>";
                return;
            }

            var html = "";

            for (var i = 0; i < eventos.length; i++) {
                var evento = eventos[i];

                var codigoTrem = evento.codigo;
                if (codigoTrem == null) {
                    codigoTrem = "-";
                }

                html = html + "<div class='hist_item'>";
                html = html + "<span class='hist_titulo'>" + evento.titulo + "</span>";
                html = html + "<span class='hist_desc'>" + evento.descricao + "</span>";
                html = html + "<span class='hist_info'>Trem: " + codigoTrem + " &nbsp;|&nbsp; " + evento.data_hora + "</span>";
                html = html + "</div>";
            }

            lista.innerHTML = html;
        })
        .catch(function () {
            alert("Não foi possível carregar o histórico. Veja o Console (F12).");
        });
}
carregarHistorico();