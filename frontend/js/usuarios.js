var botaoModo = document.getElementById("btnModo");
var botaoNovo = document.getElementById("btnNovoUsuario");
var formFiltro = document.getElementById("formFiltro");

var modal = document.getElementById("modalUsuario");
var botaoFecharModal = document.getElementById("btnFecharModal");
var formulario = document.getElementById("formUsuario");

var campoId = document.getElementById("campoId");
var campoNome = document.getElementById("campoNome");
var campoSobrenome = document.getElementById("campoSobrenome");
var campoEmail = document.getElementById("campoEmail");
var campoSenha = document.getElementById("campoSenha");
var campoPerfil = document.getElementById("campoPerfil");
var campoStatus = document.getElementById("campoStatus");

var listaUsuarios = [];   
var listaFiltrada = [];    
var paginaAtual = 1;
var totalPaginas = 1;
var porPagina = 8;        
var modoAdmin = true;   

function limpar(texto) {
    texto = String(texto);
    texto = texto.replace(/&/g, "&amp;");
    texto = texto.replace(/</g, "&lt;");
    texto = texto.replace(/>/g, "&gt;");
    return texto;
}

function nomeDoPerfil(perfil) {
    if (perfil == "admin") return "Admin";
    if (perfil == "operador") return "Operador";
    return "Comum";
}

function porcentagem(parte, total) {
    if (total == 0) {
        return "0,0%";
    }

    var valor = (parte / total) * 100;
    valor = valor.toFixed(1);        
    return valor.replace(".", ",") + "%";  
}

function carregarUsuarios(irParaUltima) {
    fetch("../../backend/api/usuarios.php")
        .then(function (resposta) {
            return resposta.json();
        })
        .then(function (usuarios) {
            if (usuarios.erro) {
                alert("Erro do banco: " + usuarios.erro);
                return;
            }

            listaUsuarios = usuarios;
            preencherCards();
            aplicarFiltro();

            if (irParaUltima) {
                paginaAtual = Math.ceil(listaFiltrada.length / porPagina);
            }

            mostrarTabela();
        })
        .catch(function (erro) {
            alert("Não foi possível carregar os usuários: " + erro);
        });
}

function preencherCards() {
    var total = listaUsuarios.length;
    var admins = 0;
    var operadores = 0;
    var ativos = 0;

    for (var i = 0; i < listaUsuarios.length; i++) {
        if (listaUsuarios[i].perfil == "admin") admins++;
        if (listaUsuarios[i].perfil == "operador") operadores++;
        if (listaUsuarios[i].status == "ativo") ativos++;
    }

    document.getElementById("cardTotal").textContent = total;
    document.getElementById("cardAdmins").textContent = admins;
    document.getElementById("cardAdminsPct").textContent = porcentagem(admins, total) + " do total";
    document.getElementById("cardOperadores").textContent = operadores;
    document.getElementById("cardOperadoresPct").textContent = porcentagem(operadores, total) + " do total";
    document.getElementById("cardAtivos").textContent = ativos;
    document.getElementById("cardAtivosPct").textContent = porcentagem(ativos, total) + " do total";
}

function aplicarFiltro() {
    var busca = document.getElementById("campoBusca").value.toLowerCase();
    var perfil = document.getElementById("filtroPerfil").value;
    var status = document.getElementById("filtroStatus").value;

    listaFiltrada = [];

    for (var i = 0; i < listaUsuarios.length; i++) {
        var u = listaUsuarios[i];

        var texto = (u.nome + " " + u.sobrenome + " " + u.email).toLowerCase();

        var achouTexto = texto.indexOf(busca) != -1;
        var achouPerfil = (perfil == "todos" || u.perfil == perfil);
        var achouStatus = (status == "todos" || u.status == status);

        if (achouTexto && achouPerfil && achouStatus) {
            listaFiltrada.push(u);
        }
    }
}

formFiltro.addEventListener("submit", function (evento) {
    evento.preventDefault();
    paginaAtual = 1;
    aplicarFiltro();
    mostrarTabela();
});

function mostrarTabela() {
    var total = listaFiltrada.length;

    totalPaginas = Math.ceil(total / porPagina);
    if (totalPaginas < 1) totalPaginas = 1;
    if (paginaAtual > totalPaginas) paginaAtual = totalPaginas;
    if (paginaAtual < 1) paginaAtual = 1;

    var inicio = (paginaAtual - 1) * porPagina;
    var fim = inicio + porPagina;
    if (fim > total) fim = total;

    var html = "";

    if (total == 0) {
        html = "<tr><td colspan='5'>Nenhum usuário encontrado.</td></tr>";
    }

    for (var i = inicio; i < fim; i++) {
        var u = listaFiltrada[i];

        html = html + "<tr>";
        html = html + "<td>" + limpar(u.nome + " " + u.sobrenome) + "</td>";
        html = html + "<td>" + limpar(u.email) + "</td>";
        html = html + "<td><span class='perfil_badge perfil_" + u.perfil + "'>" + nomeDoPerfil(u.perfil) + "</span></td>";

        if (u.status == "ativo") {
            html = html + "<td><span class='status_pill st_ativo'>Ativo</span></td>";
        } else {
            html = html + "<td><span class='status_pill st_inativo'>Inativo</span></td>";
        }

        html = html + "<td class='so_admin'><div class='acoes'>";
        html = html + "<button class='btn_acao' title='Editar' onclick='editarUsuario(" + i + ")'>✎</button>";

        if (u.status == "ativo") {
            html = html + "<button class='btn_acao btn_bloquear' title='Desativar usuário' onclick='alternarStatus(" + i + ")'>⊘</button>";
        } else {
            html = html + "<button class='btn_acao btn_reativar' title='Reativar usuário' onclick='alternarStatus(" + i + ")'>✓</button>";
        }

        html = html + "</div></td>";
        html = html + "</tr>";
    }

    document.getElementById("tabelaUsuarios").innerHTML = html;

    if (total == 0) {
        document.getElementById("textoMostrando").textContent = "Nenhum usuário";
    } else {
        document.getElementById("textoMostrando").textContent =
            "Mostrando " + (inicio + 1) + " a " + fim + " de " + total + " usuários";
    }

    montarPaginacao();
}

function montarPaginacao() {
    var html = "";

    html = html + "<button class='pag_seta' onclick='irParaPagina(" + (paginaAtual - 1) + ")'>&lt;</button>";

    for (var p = 1; p <= totalPaginas; p++) {
        var classe = "pag_num";
        if (p == paginaAtual) {
            classe = "pag_num pag_atual";
        }
        html = html + "<button class='" + classe + "' onclick='irParaPagina(" + p + ")'>" + p + "</button>";
    }

    html = html + "<button class='pag_seta' onclick='irParaPagina(" + (paginaAtual + 1) + ")'>&gt;</button>";

    document.getElementById("paginacao").innerHTML = html;
}

function irParaPagina(numero) {
    if (numero < 1 || numero > totalPaginas) {
        return;
    }

    paginaAtual = numero;
    mostrarTabela();
}

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

function abrirModalNovo() {
    if (modoAdmin == false) {
        return; 
    }

    formulario.reset();
    campoId.value = "";
    campoSenha.required = true;
    campoSenha.placeholder = "";

    document.getElementById("tituloModal").textContent = "Novo usuário";
    document.getElementById("btnSalvar").textContent = "Adicionar usuário";

    modal.classList.add("aberto");
}

function editarUsuario(posicao) {
    if (modoAdmin == false) {
        return; 
    }

    var u = listaFiltrada[posicao];

    campoId.value = u.id;
    campoNome.value = u.nome;
    campoSobrenome.value = u.sobrenome;
    campoEmail.value = u.email;
    campoSenha.value = "";
    campoPerfil.value = u.perfil;
    campoStatus.value = u.status;

    campoSenha.required = false;
    campoSenha.placeholder = "Deixe vazio para manter a atual";

    document.getElementById("tituloModal").textContent = "Editar usuário";
    document.getElementById("btnSalvar").textContent = "Salvar alterações";

    modal.classList.add("aberto");
}

function fecharModal() {
    modal.classList.remove("aberto");
}

botaoNovo.addEventListener("click", abrirModalNovo);
botaoFecharModal.addEventListener("click", fecharModal);

modal.addEventListener("click", function (evento) {
    if (evento.target == modal) {
        fecharModal();
    }
});

formulario.addEventListener("submit", function (evento) {
    evento.preventDefault();


    var estaEditando = (campoId.value != "");

    var url = "../../backend/api/adicionar_usuario.php";
    if (estaEditando) {
        url = "../../backend/api/editar_usuario.php";
    }

    var dados = new FormData(formulario);

    fetch(url, {
        method: "POST",
        body: dados
    })
        .then(function (resposta) {
            return resposta.json();
        })
        .then(function (resultado) {
            if (resultado.sucesso) {
                if (estaEditando) {
                    alert("Usuário atualizado com sucesso!");
                } else {
                    alert("Usuário cadastrado com sucesso!");
                }

                fecharModal();

                carregarUsuarios(!estaEditando);
            } else {
                alert("Erro: " + (resultado.erro || "tente novamente"));
            }
        })
        .catch(function (erro) {
            alert("Não foi possível falar com o servidor: " + erro);
        });
});

function alternarStatus(posicao) {
    if (modoAdmin == false) {
        return; 
    }

    var u = listaFiltrada[posicao];

    var acao = "desativar";
    if (u.status == "inativo") {
        acao = "reativar";
    }

    var confirmou = confirm("Deseja " + acao + " o usuário " + u.nome + " " + u.sobrenome + "?");
    if (confirmou == false) {
        return;
    }

    var dados = new FormData();
    dados.append("id", u.id);

    fetch("../../backend/api/alternar_status_usuario.php", {
        method: "POST",
        body: dados
    })
        .then(function (resposta) {
            return resposta.json();
        })
        .then(function (resultado) {
            if (resultado.sucesso) {
                carregarUsuarios(false);
            } else {
                alert("Erro: " + (resultado.erro || "tente novamente"));
            }
        })
        .catch(function (erro) {
            alert("Não foi possível falar com o servidor: " + erro);
        });
}

carregarUsuarios(false);