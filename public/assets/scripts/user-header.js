function mostrarStatusUsuario() {
    const userDiv = document.getElementById("user-info");
    const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));

    if (usuario) {
        userDiv.innerHTML = `
            Olá, ${usuario.nome}
            <button id="btn-logout">Sair</button>
        `;

        document.getElementById("btn-logout").addEventListener("click", () => {
            localStorage.removeItem("usuarioLogado");
            location.reload();  // Recarrega a página para atualizar o header
        });
    } else {
        userDiv.innerHTML = `<a href="login.html">Login</a>`;
    }
}