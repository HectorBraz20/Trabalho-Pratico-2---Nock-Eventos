const API_URL = "http://localhost:3000/eventos";

document.addEventListener("DOMContentLoaded", () => {
    carregarEventos();
    carregarDestaques();
    mostrarStatusUsuario();
});

async function carregarEventos() {
    try {
        const resposta = await fetch(API_URL);
        const eventos = await resposta.json();

        const container = document.getElementById("eventos-container");
        container.innerHTML = "";

        eventos.forEach(evento => {
            const favorito = isFavorito(evento.id);

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
                                <button class="btn ${favorito ? 'btn-success text-white' : 'btn-outline-light text-white'} flex-fill" onclick="toggleFavorito('${evento.id}')">
                                     ${favorito ? '★ Favorito' : '☆ Favoritar'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            container.innerHTML += card;
        });
    } catch (erro) {
        console.error("Erro ao carregar eventos:", erro);
    }
}

async function carregarDestaques() {
    try {
        const resposta = await fetch(API_URL);
        const eventos = await resposta.json();
        const destaques = eventos.filter(e => e.destaque);

        const carousel = document.getElementById("carousel-destaques");
        carousel.innerHTML = "";

        destaques.forEach((evento, index) => {
            const item = `
                <div class="carousel-item ${index === 0 ? "active" : ""}">
                    <img src="${evento.imagem}" class="d-block w-100" alt="${evento.titulo}" style="height: 400px; object-fit: cover;">
                    <div class="carousel-caption d-none d-md-block bg-dark bg-opacity-50 rounded p-2">
                        <h5>${evento.titulo}</h5>
                        <p>${evento.descricao}</p>
                    </div>
                </div>
            `;
            carousel.innerHTML += item;
        });
    } catch (erro) {
        console.error("Erro ao carregar destaques:", erro);
    }
}

function formatarData(data) {
    const opcoes = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(data).toLocaleDateString('pt-BR', opcoes);
}

// ===== Funções de Favoritar Eventos =====

function toggleFavorito(eventoId) {
    const userId = localStorage.getItem("userId") || "default";
    const chaveFavoritos = `favoritos_${userId}`;
    let favoritos = JSON.parse(localStorage.getItem(chaveFavoritos)) || [];

    if (favoritos.includes(eventoId)) {
        favoritos = favoritos.filter(id => id !== eventoId);
    } else {
        favoritos.push(eventoId);
    }

    localStorage.setItem(chaveFavoritos, JSON.stringify(favoritos));

    // Atualiza os cards na tela
    carregarEventos();
}

function isFavorito(eventoId) {
    const userId = localStorage.getItem("userId") || "default";
    const chaveFavoritos = `favoritos_${userId}`;
    const favoritos = JSON.parse(localStorage.getItem(chaveFavoritos)) || [];
    return favoritos.includes(eventoId);
}
