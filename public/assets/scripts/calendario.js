const API_URL = "http://localhost:3000/eventos";

document.addEventListener("DOMContentLoaded", async function () {
    const calendarEl = document.getElementById('calendar');

    const eventos = await buscarEventos();

    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        locale: 'pt-br',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,listMonth'
        },
        buttonText: {
            today: 'Hoje',
            month: 'Mês',
            list: 'Lista'
        },
        events: eventos,
        eventClick: function (info) {
            const eventoId = info.event.id;
            window.location.href = `detalhes.html?id=${eventoId}`;
        }
    });

    calendar.render();
});

async function buscarEventos() {
    try {
        const resposta = await fetch(API_URL);
        const eventos = await resposta.json();

        return eventos.map(evento => ({
            id: evento.id,
            title: evento.titulo,
            start: evento.data,
            url: `detalhes.html?id=${evento.id}`
        }));
    } catch (erro) {
        console.error("Erro ao buscar eventos:", erro);
        return [];
    }
}
