const API_URL_USUARIOS = "http://localhost:3000/usuarios";

document.getElementById("form-login").addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email-login").value;
    const senha = document.getElementById("senha-login").value;

    try {
        const resposta = await fetch(`${API_URL_USUARIOS}?email=${email}&senha=${senha}`);
        const usuarios = await resposta.json();

        if (usuarios.length > 0) {
            alert(`Bem-vindo, ${usuarios[0].nome}!`);
            // Opcional: salvar login no localStorage
            localStorage.setItem("usuarioLogado", JSON.stringify(usuarios[0]));
            window.location.href = "index.html";
        } else {
            alert("Email ou senha incorretos.");
        }
    } catch (erro) {
        console.error("Erro no login:", erro);
        alert("Erro ao tentar fazer login.");
    }
});