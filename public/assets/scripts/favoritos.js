const API_URL = "http://localhost:3000/eventos";

document.addEventListener("DOMContentLoaded", () => {
    carregarEventosFavoritos();
    mostrarStatusUsuario();
});

async function carregarEventosFavoritos() {
    try {
        const resposta = await fetch(API_URL);
        const eventos = await resposta.json();

        const userId = localStorage.getItem("userId") || "default";
        const chaveFavoritos = `favoritos_${userId}`;
        const favoritos = JSON.parse(localStorage.getItem(chaveFavoritos)) || [];

        const container = document.getElementById("eventos-container");
        container.innerHTML = "";

        const eventosFavoritos = eventos.filter(evento => favoritos.includes(evento.id));

        if (eventosFavoritos.length === 0) {
            container.innerHTML = `<p class="text-center text-muted">Você ainda não favoritou nenhum evento.</p>`;
            return;
        }

        eventosFavoritos.forEach(evento => {
            const card = `
                <div class="col-md-4 mb-4">
                    <div class="card h-100 shadow-sm">
                        <img src="${evento.imagem}" class="card-img-top" alt="${evento.titulo}" style="height: 200px; object-fit: cover;">
                        <div class="card-body d-flex flex-column">
                            <h5 class="card-title">${evento.titulo}</h5>
                            <p><strong>Data:</strong> ${formatarData(evento.data)}</p>
                            <p><strong>Local:</strong> ${evento.local}</p>
                            
                            <div class="mt-auto d-flex gap-2">
                                <a href="detalhes.html?id=${evento.id}" class="btn btn-primary flex-fill">Ver mais</a>
                                <button class="btn btn-success text-white flex-fill" onclick="removerFavorito('${evento.id}')">
                                    ★ Remover
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            container.innerHTML += card;
        });
    } catch (erro) {
        console.error("Erro ao carregar favoritos:", erro);
    }
}

function formatarData(data) {
    const opcoes = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(data).toLocaleDateString('pt-BR', opcoes);
}

function removerFavorito(eventoId) {
    const userId = localStorage.getItem("userId") || "default";
    const chaveFavoritos = `favoritos_${userId}`;
    let favoritos = JSON.parse(localStorage.getItem(chaveFavoritos)) || [];

    favoritos = favoritos.filter(id => id !== eventoId);
    localStorage.setItem(chaveFavoritos, JSON.stringify(favoritos));

    // Atualiza a lista
    carregarEventosFavoritos();
}
