const API_URL = "http://localhost:3000/eventos";

// Simula pegar o ID do usuário logado
const userIdLogado = localStorage.getItem("userId") || "6710";

document.addEventListener("DOMContentLoaded", () => {
    carregarMeusEventos();
});

async function carregarMeusEventos() {
    try {
        const resposta = await fetch(`${API_URL}?userId=${userIdLogado}`);
        const eventos = await resposta.json();

        const container = document.getElementById("meus-eventos-container");
        container.innerHTML = "";

        if (eventos.length === 0) {
            container.innerHTML = "<p>Você ainda não cadastrou nenhum evento.</p>";
            return;
        }

        const tabela = document.createElement("table");
        tabela.className = "table table-striped table-hover";

        tabela.innerHTML = `
            <thead class="table-dark">
                <tr>
                    <th>ID</th>
                    <th>Título</th>
                    <th>Data</th>
                    <th>Horário</th>
                    <th>Local</th>
                    <th>Imagem</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody>
                ${eventos.map(evento => `
                    <tr>
                        <td>${evento.id}</td>
                        <td>${evento.titulo}</td>
                        <td>${formatarData(evento.data)}</td>
                        <td>${evento.horario}</td>
                        <td>${evento.local}</td>
                        <td>
                            <a href="${evento.imagem}" target="_blank">${evento.imagem}</a>
                        </td>
                        <td>
                            <button class="btn btn-sm btn-warning me-1" onclick="editarEvento('${evento.id}')">Editar</button>
                            <button class="btn btn-sm btn-danger" onclick="deletarEvento('${evento.id}')">Excluir</button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        `;

        container.appendChild(tabela);

    } catch (erro) {
        console.error("Erro ao carregar seus eventos:", erro);
    }
}

function formatarData(data) {
    const opcoes = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(data).toLocaleDateString('pt-BR', opcoes);
}

function editarEvento(id) {
    window.location.href = `editar-evento.html?id=${id}`;
}

async function deletarEvento(id) {
    if (confirm("Tem certeza que deseja excluir este evento?")) {
        try {
            const resposta = await fetch(`${API_URL}/${id}`, { method: "DELETE" });

            if (resposta.ok) {
                alert("Evento excluído com sucesso!");
                carregarMeusEventos();
            } else {
                alert("Erro ao excluir o evento.");
            }
        } catch (erro) {
            console.error("Erro ao deletar evento:", erro);
        }
    }
}
