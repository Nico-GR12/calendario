const API = '/api/reservas';

let calendar;
let reservaSeleccionadaId = null;

document.addEventListener('DOMContentLoaded', function () {
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

        // ✅ Reemplaza _supabase.from('reservas').select('*')
        events: async function (info, successCallback) {
            const res = await fetch(API);
            const data = await res.json();
            successCallback(data.map(res => ({
                id: res.id,
                title: res.nombre.toUpperCase(),
                start: `${res.fecha.split('T')[0]}T${res.hora_inicio}`,
                end: `${res.fecha.split('T')[0]}T${res.hora_fin}`,
                color: '#39A900'
            })));
        },

        datesSet: function () {
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
    const meses = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
    document.getElementById('modalDateTitle').innerText = `${partes[2]}/${meses[parseInt(partes[1]) - 1]}/${partes[0]}`;
    document.getElementById('btnEliminar').classList.add('hidden');
    document.getElementById('modal').classList.remove('hidden');
}

function abrirParaEditar(evento) {
    reservaSeleccionadaId = evento.id;
    const fecha = evento.startStr ? evento.startStr.split('T')[0] : '';
    const inicio = (evento.startStr && evento.startStr.includes('T')) ? evento.startStr.split('T')[1].substring(0, 5) : '';
    const fin = (evento.endStr && evento.endStr.includes('T')) ? evento.endStr.split('T')[1].substring(0, 5) : '';

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

// ✅ Reemplaza _supabase.from('reservas').insert / .update
document.getElementById('reservaForm').onsubmit = async (e) => {
    e.preventDefault();
    const datos = {
        nombre: document.getElementById('nombre').value,
        fecha: document.getElementById('fechaInput').value,
        hora_inicio: document.getElementById('inicio').value,
        hora_fin: document.getElementById('fin').value
    };

    if (reservaSeleccionadaId) {
        await fetch(`${API}/${reservaSeleccionadaId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        });
    } else {
        await fetch(API, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        });
    }

    closeModal();
    calendar.refetchEvents();
    Swal.fire({ title: '¡Guardado!', icon: 'success', confirmButtonColor: '#39A900' });
};

// ✅ Reemplaza _supabase.from('reservas').delete()
async function eliminarReserva() {
    if (!reservaSeleccionadaId) return;
    const result = await Swal.fire({
        title: '¿Eliminar?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#39A900',
        confirmButtonText: 'Sí, borrar',
        reverseButtons: true
    });
    if (result.isConfirmed) {
        await fetch(`${API}/${reservaSeleccionadaId}`, { method: 'DELETE' });
        closeModal();
        calendar.refetchEvents();
        Swal.fire({ title: 'Eliminado', icon: 'success', confirmButtonColor: '#39A900' });
    }
}