const API_URL = "http://localhost:3000/eventos";
const params = new URLSearchParams(window.location.search);
const eventoId = params.get("id");

let eventoOriginal = null;

document.addEventListener("DOMContentLoaded", () => {
    if (!eventoId) {
        alert("ID do evento não informado.");
        window.location.href = "meus-eventos.html";
        return;
    }
    carregarEvento();
    document.getElementById("form-editar-evento").addEventListener("submit", salvarEdicao);
});

async function carregarEvento() {
    try {
        const resposta = await fetch(`${API_URL}/${eventoId}`);
        if (!resposta.ok) throw new Error("Evento não encontrado.");

        eventoOriginal = await resposta.json();

        document.getElementById("titulo").value = eventoOriginal.titulo;
        document.getElementById("descricao").value = eventoOriginal.descricao;
        document.getElementById("data").value = eventoOriginal.data;
        document.getElementById("horario").value = eventoOriginal.horario;
        document.getElementById("local").value = eventoOriginal.local;
        document.getElementById("imagem").value = eventoOriginal.imagem;
        document.getElementById("destaque").checked = eventoOriginal.destaque === true;
    } catch (erro) {
        console.error("Erro ao carregar evento:", erro);
        alert("Erro ao carregar os dados do evento.");
        window.location.href = "meus-eventos.html";
    }
}

async function salvarEdicao(event) {
    event.preventDefault();

    const eventoAtualizado = {
        ...eventoOriginal,
        titulo: document.getElementById("titulo").value,
        descricao: document.getElementById("descricao").value,
        data: document.getElementById("data").value,
        horario: document.getElementById("horario").value,
        local: document.getElementById("local").value,
        imagem: document.getElementById("imagem").value,
        destaque: document.getElementById("destaque").checked
    };

    try {
        const resposta = await fetch(`${API_URL}/${eventoId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(eventoAtualizado)
        });

        if (resposta.ok) {
            alert("Evento atualizado com sucesso!");
            window.location.href = "meus-eventos.html";
        } else {
            alert("Erro ao atualizar o evento.");
        }
    } catch (erro) {
        console.error("Erro ao salvar edição:", erro);
        alert("Erro ao salvar as alterações.");
    }
}
