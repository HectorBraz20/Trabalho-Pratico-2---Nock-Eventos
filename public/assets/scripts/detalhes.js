document.addEventListener("DOMContentLoaded", async () => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    if (!id) {
        document.getElementById("detalhes-evento").innerHTML = "<h2 class='text-danger'>Evento não encontrado!</h2>";
        return;
    }

    try {
        const resposta = await fetch(`http://localhost:3000/eventos/${id}`);
        if (!resposta.ok) throw new Error("Evento não encontrado na API.");

        const evento = await resposta.json();

        // Preenche os campos do HTML
        document.getElementById("imagem-evento").src = evento.imagem;
        document.getElementById("imagem-evento").alt = evento.titulo;
        document.getElementById("titulo-evento").textContent = evento.titulo;
        document.getElementById("descricao-evento").textContent = evento.descricao;

        // Formatação de data para o padrão brasileiro
        const dataFormatada = new Date(evento.data).toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        });

        document.getElementById("data-evento").textContent = dataFormatada;
        document.getElementById("hora-evento").textContent = evento.horario || "Horário não informado";
        document.getElementById("local-evento").textContent = evento.local;

        // Mostrar o conteúdo e esconder o loading
        document.querySelector("#detalhes-evento h2").style.display = "none";
        document.getElementById("conteudo-evento").style.display = "block";

        // ================= Favoritar =================
        const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));
        const btnFavoritar = document.getElementById("btn-favoritar");

        if (usuario && btnFavoritar) {
            btnFavoritar.style.display = "block";
            atualizarBotaoFavorito(id);

            btnFavoritar.addEventListener("click", () => {
                toggleFavorito(id);
                atualizarBotaoFavorito(id);
            });
        }

    } catch (erro) {
        console.error("Erro ao carregar evento:", erro);
        document.getElementById("detalhes-evento").innerHTML = "<h2 class='text-danger'>Erro ao carregar o evento.</h2>";
    }
});

// ===== Funções de Favoritar com LocalStorage =====

function getChaveFavoritos() {
    const userId = localStorage.getItem("userId") || "default";
    return `favoritos_${userId}`;
}

function toggleFavorito(eventoId) {
    const chaveFavoritos = getChaveFavoritos();
    let favoritos = JSON.parse(localStorage.getItem(chaveFavoritos)) || [];

    if (favoritos.includes(eventoId)) {
        favoritos = favoritos.filter(id => id !== eventoId);
    } else {
        favoritos.push(eventoId);
    }

    localStorage.setItem(chaveFavoritos, JSON.stringify(favoritos));
}

function isFavorito(eventoId) {
    const chaveFavoritos = getChaveFavoritos();
    const favoritos = JSON.parse(localStorage.getItem(chaveFavoritos)) || [];
    return favoritos.includes(eventoId);
}

function atualizarBotaoFavorito(eventoId) {
    const btnFavoritar = document.getElementById("btn-favoritar");
    if (!btnFavoritar) return;

    if (isFavorito(eventoId)) {
        btnFavoritar.textContent = "★ Evento Favoritado";
        btnFavoritar.classList.add("favoritado");
    } else {
        btnFavoritar.textContent = "☆ Adicionar aos Favoritos";
        btnFavoritar.classList.remove("favoritado");
    }
}
