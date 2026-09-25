document.addEventListener("DOMContentLoaded", () => {

    const btnEntrar = document.querySelector(".login-btn");

    const usuarioInput = document.getElementById("usuario");
    const senhaInput = document.getElementById("senha");

    btnEntrar.addEventListener("click", async () => {

        const identificador = usuarioInput.value.trim();
        const senha = senhaInput.value.trim();

        if (!identificador || !senha) {
            alert("Por favor, preencha todos os campos.");
            return;
        }

        try {

            const resposta = await fetch(
                "/ferrorama/backend/api/login.php",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        identificador: identificador,
                        senha: senha
                    })
                }
            );

            const dados = await resposta.json();
            
            if (dados.sucesso) {

                localStorage.setItem(
                    "usuarioLogado",
                    JSON.stringify(dados.usuario)
                );

                alert("Login realizado com sucesso!");

                window.location.href = "dashboard.html";

            } else {

                alert(dados.mensagem);

            }

        } catch (erro) {

            console.error(erro);

            alert("Não foi possível conectar ao servidor.");

        }

    });

});