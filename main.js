let calendar;
let reservaSeleccionadaId = null;

document.addEventListener('DOMContentLoaded', function() {
    const calendarEl = document.getElementById('calendar');
    
    calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        locale: 'es',
        firstDay: 1,
        navLinks: true,
        height: 'auto',
        expandRows: true,
        slotMinTime: '06:00:00',
        slotMaxTime: '22:00:00',
        headerToolbar: { 
            left: 'prev,next today', 
            center: 'title', 
            right: 'dayGridMonth,timeGridDay' 
        },
        buttonText: { today: 'Hoy', month: 'Mes', day: 'Día' },

        dateClick: (info) => {
            if (info.view.type === 'dayGridMonth') {
                calendar.changeView('timeGridDay', info.dateStr);
            } else {
                openModal(info.dateStr);
            }
        },

        eventClick: (info) => abrirParaEditar(info.event),

        events: async function(info, successCallback) {
            const res = await fetch("/reservas");
            const data = await res.json();

            if (res.ok && Array.isArray(data)) {
                console.log("📅 Cargando eventos:", data.length);
                successCallback(data.map(res => {
                    // Extraer la fecha sin la hora
                    const fecha = new Date(res.fecha).toISOString().split('T')[0];
                    return {
                        id: res.id,
                        title: res.nombre.toUpperCase(),
                        start: `${fecha}T${res.hora_inicio}`,
                        end: `${fecha}T${res.hora_fin}`,
                        color: '#39A900'
                    };
                }));
            } else {
                console.error("Error cargando reservas:", data);
                successCallback([]);
            }
        },

        datesSet: function() {
            const titleEl = document.querySelector('.fc-toolbar-title');
            if (titleEl) {
                const hoy = new Date();
                const diaHoy = String(hoy.getDate()).padStart(2, '0');
                const vistaActual = calendar.getDate();
                const mesNombre = vistaActual.toLocaleString('es-ES', { month: 'long' });
                const anioActual = vistaActual.getFullYear();
                titleEl.innerText = `${diaHoy}/${mesNombre}/${anioActual}`;
            }
        }
    });

    calendar.render();
});

function openModal(date) {
    reservaSeleccionadaId = null;
    document.getElementById('reservaForm').reset();
    document.getElementById('fechaInput').value = date;

    const partes = date.split('-');
    const meses = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];

    document.getElementById('modalDateTitle').innerText = `${partes[2]}/${meses[parseInt(partes[1])-1]}/${partes[0]}`;
    document.getElementById('btnEliminar').classList.add('hidden');
    document.getElementById('modal').classList.remove('hidden');
}

function abrirParaEditar(evento) {
    reservaSeleccionadaId = evento.id;

    const fecha = evento.startStr.split('T')[0];
    const inicio = evento.startStr.split('T')[1].substring(0,5);
    const fin = evento.endStr.split('T')[1].substring(0,5);

    document.getElementById('modalDateTitle').innerText = "Editar Reserva";
    document.getElementById('nombre').value = evento.title;
    document.getElementById('fechaInput').value = fecha;
    document.getElementById('inicio').value = inicio;
    document.getElementById('fin').value = fin;
    document.getElementById('btnEliminar').classList.remove('hidden');
    document.getElementById('modal').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('modal').classList.add('hidden');
}

document.getElementById('reservaForm').onsubmit = async (e) => {
    e.preventDefault();

    const datos = {
        nombre: document.getElementById('nombre').value,
        fecha: document.getElementById('fechaInput').value,
        hora_inicio: document.getElementById('inicio').value,
        hora_fin: document.getElementById('fin').value
    };

    console.log("📤 Enviando datos:", datos);

    try {
        if (reservaSeleccionadaId) {
            const res = await fetch(`/reservas/${reservaSeleccionadaId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(datos)
            });
            console.log("PUT response:", res.status);
        } else {
            const res = await fetch("/reservas", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(datos)
            });
            console.log("POST response:", res.status);
        }

        closeModal();
        calendar.refetchEvents();
        Swal.fire({ title: '¡Guardado!', icon: 'success' });
    } catch (error) {
        console.error("❌ Error:", error);
        Swal.fire({ title: 'Error', text: error.message, icon: 'error' });
    }
};

async function eliminarReserva() {
    if (!reservaSeleccionadaId) return;

    const result = await Swal.fire({
        title: '¿Eliminar?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, borrar'
    });

    if (result.isConfirmed) {
        await fetch(`/reservas/${reservaSeleccionadaId}`, {
            method: "DELETE"
        });

        closeModal();
        calendar.refetchEvents();
        Swal.fire({ title: 'Eliminado', icon: 'success' });
    }
}