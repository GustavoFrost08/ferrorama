document.addEventListener("DOMContentLoaded", () => {

    const selectAno = document.getElementById("dob-year");

    const anoAtual = new Date().getFullYear();
    const anoLimite = 1930;

    for (let ano = anoAtual; ano >= anoLimite; ano--) {
        const option = document.createElement("option");

        option.value = ano;
        option.textContent = ano;

        selectAno.appendChild(option);
    }

    const formulario = document.getElementById("form-cadastro");

    formulario.addEventListener("submit", async (e) => {

        e.preventDefault();

        const identificador = document.getElementById("user-contact").value.trim();
        const senha = document.getElementById("password").value.trim();
        const nome = document.getElementById("first-name").value.trim();
        const sobrenome = document.getElementById("last-name").value.trim();

        const dia = document.getElementById("dob-day").value;
        const mes = document.getElementById("dob-month").value;
        const ano = document.getElementById("dob-year").value;

        if (!identificador || !senha || !nome || !sobrenome || !dia || !mes || !ano) {
            alert("Preencha todos os campos.");
            return;
        }

        const dataNascimento =
            `${ano}-${mes.padStart(2, "0")}-${dia.padStart(2, "0")}`;

        try {

            const resposta = await fetch(
    "http://localhost:8080/ferrorama/backend/api/cadastro.php",
    {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            identificador: identificador,
            senha: senha,
            nome: nome,
            sobrenome: sobrenome,
            data_nascimento: dataNascimento
        })
    }
);

            const dados = await resposta.json();

            if (dados.sucesso) {

                alert("Cadastro realizado com sucesso!");

                window.location.href = "/ferrorama/frontend/html/login.html";

            } else {

                alert(dados.mensagem);

            }

        } catch (erro) {

    console.error("Erro:", erro);

    alert("Erro ao conectar com o servidor. Verifique o console.");

}
    });
});