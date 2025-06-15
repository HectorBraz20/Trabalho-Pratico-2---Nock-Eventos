const API_URL_USUARIOS = "http://localhost:3000/usuarios";

document.getElementById("form-cadastro").addEventListener("submit", async (e) => {
    e.preventDefault();

    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email-cadastro").value;
    const senha = document.getElementById("senha-cadastro").value;

    try {
        // Verificar se o email já existe
        const resposta = await fetch(`${API_URL_USUARIOS}?email=${email}`);
        const usuariosExistentes = await resposta.json();

        if (usuariosExistentes.length > 0) {
            alert("Este e-mail já está cadastrado. Tente fazer login.");
            return;
        }

        // Cadastrar novo usuário
        await fetch(API_URL_USUARIOS, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nome, email, senha })
        });

        alert("Cadastro realizado com sucesso! Agora faça login.");
        window.location.href = "login.html";
    } catch (erro) {
        console.error("Erro no cadastro:", erro);
        alert("Erro ao tentar cadastrar usuário.");
    }
});
