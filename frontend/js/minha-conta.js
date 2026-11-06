async function carregarConta() {

    try {
        let resposta = await fetch("/ferrorama/backend/api/conta.php", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({acao: "buscar"})
        });

        let dados = await resposta.json();

        if (!dados.sucesso) {
            alert(dados.mensagem);
            window.location.href = "login.html";
            return;
        }

        let u = dados.usuario;

        nome.value = u.nome;
        sobrenome.value = u.sobrenome;
        email.value = u.email || "";
        telefone.value = u.telefone || "";

        nomeCompleto.textContent = u.nome + " " + u.sobrenome;
        perfilUsuario.textContent = u.perfil;
        perfilInfo.textContent = u.perfil;
        statusInfo.textContent = u.status;

        localStorage.setItem("usuarioLogado", JSON.stringify(u));

    } catch (erro) {
        alert("Erro ao carregar os dados da conta.");
        console.log(erro);
    }
}

document.getElementById("formConta").addEventListener("submit", async function(e) {

    e.preventDefault();

    let resposta = await fetch("/ferrorama/backend/api/conta.php", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            acao: "atualizar",
            nome: nome.value,
            sobrenome: sobrenome.value,
            email: email.value,
            telefone: telefone.value
        })
    });

    let dados = await resposta.json();

    alert(dados.mensagem);

    if (dados.sucesso) carregarConta();

});

document.getElementById("btnSair").addEventListener("click", async function() {

    if (!confirm("Deseja realmente sair da sua conta?")) return;

    await fetch("/ferrorama/backend/api/conta.php", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({acao: "sair"})
    });

    localStorage.removeItem("usuarioLogado");
    window.location.href = "login.html";

});

carregarConta();