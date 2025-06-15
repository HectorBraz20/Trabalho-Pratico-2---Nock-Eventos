// Máscara de data para o formato dd/mm/aaaa
document.getElementById("data").addEventListener("input", function (e) {
    let value = e.target.value.replace(/\D/g, "").slice(0, 8);
    if (value.length >= 5) {
        e.target.value = value.replace(/(\d{2})(\d{2})(\d{0,4})/, "$1/$2/$3");
    } else if (value.length >= 3) {
        e.target.value = value.replace(/(\d{2})(\d{0,2})/, "$1/$2");
    } else {
        e.target.value = value;
    }
});

// Função para converter dd/mm/aaaa para aaaa-mm-dd (ISO)
function converterDataParaISO(dataBR) {
    const partes = dataBR.split("/");
    if (partes.length === 3) {
        const [dia, mes, ano] = partes;
        return `${ano}-${mes}-${dia}`;
    }
    return dataBR;  // Caso o usuário digite algo fora do formato
}

document.getElementById("form-anunciar-evento").addEventListener("submit", async (e) => {
    e.preventDefault();

    const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));
    if (!usuario) {
        alert("Você precisa estar logado para anunciar um evento!");
        window.location.href = "login.html";
        return;
    }

    const dataISO = converterDataParaISO(document.getElementById("data").value);

    const novoEvento = {
        titulo: document.getElementById("titulo").value,
        descricao: document.getElementById("descricao").value,
        data: dataISO,
        horario: document.getElementById("horario").value,
        local: document.getElementById("local").value,
        imagem: document.getElementById("imagem").value,
        userId: usuario.id
    };

    try {
        const resposta = await fetch("http://localhost:3000/eventos", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(novoEvento)
        });

        if (resposta.ok) {
            alert("Evento anunciado com sucesso!");
            window.location.href = "index.html";
        } else {
            alert("Erro ao anunciar evento.");
        }
    } catch (erro) {
        console.error("Erro ao anunciar evento:", erro);
    }
});
