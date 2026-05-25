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
        views: {
            dayGridMonth: {
                titleFormat: { year: 'numeric', month: 'long' }
            },
            timeGridDay: {
                titleFormat: { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
            }
        },

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
                successCallback(data.map(res => {
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

    });

    calendar.render();
});

function formatearFecha(dateStr) {
    const soloFecha = dateStr.split('T')[0];
    const partes = soloFecha.split('-');
    const meses = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];
    return `${parseInt(partes[2])} de ${meses[parseInt(partes[1])-1]} de ${partes[0]}`;
}

function openModal(date) {
    reservaSeleccionadaId = null;
    document.getElementById('reservaForm').reset();
    document.getElementById('fechaInput').value = date;
    document.getElementById('modalDateTitle').innerHTML = `
        <span class="text-white/90">+</span> Nueva Reserva
        <p class="text-sm font-normal text-white/70 mt-1">${formatearFecha(date)}</p>
    `;
    document.getElementById('btnEliminar').classList.add('hidden');
    document.getElementById('modal').classList.remove('hidden');
    document.getElementById('modal').classList.add('modal-enter');
    document.getElementById('nombre').focus();
}

function abrirParaEditar(evento) {
    reservaSeleccionadaId = evento.id;

    const fecha = evento.startStr.split('T')[0];
    const inicio = evento.startStr.split('T')[1].substring(0,5);
    const fin = evento.endStr.split('T')[1].substring(0,5);

    document.getElementById('modalDateTitle').innerHTML = `
        ${evento.title}
        <span class="block text-sm font-normal text-white/70 mt-1">${formatearFecha(fecha)}</span>
        <span class="block text-sm font-normal text-white/70">${inicio} - ${fin}</span>
    `;
    document.getElementById('nombre').value = evento.title;
    document.getElementById('fechaInput').value = fecha;
    document.getElementById('inicio').value = inicio;
    document.getElementById('fin').value = fin;
    document.getElementById('btnEliminar').classList.remove('hidden');
    document.getElementById('modal').classList.remove('hidden');
    document.getElementById('modal').classList.add('modal-enter');
}

function closeModal() {
    document.getElementById('modal').classList.remove('modal-enter');
    document.getElementById('modal').classList.add('hidden');
}

function mostrarError(mensaje) {
    Swal.fire({
        title: 'Error',
        text: mensaje,
        icon: 'error',
        confirmButtonColor: '#39A900'
    });
}

function validarFormulario(datos) {
    if (!datos.fecha) {
        mostrarError('Debes seleccionar una fecha primero');
        return false;
    }
    if (!datos.nombre || !datos.nombre.trim()) {
        mostrarError('El nombre del instructor es obligatorio');
        return false;
    }
    if (!datos.hora_inicio) {
        mostrarError('La hora de inicio es obligatoria');
        return false;
    }
    if (!datos.hora_fin) {
        mostrarError('La hora de fin es obligatoria');
        return false;
    }
    if (datos.hora_inicio >= datos.hora_fin) {
        mostrarError('La hora de inicio debe ser menor a la hora de fin');
        return false;
    }
    return true;
}

document.getElementById('reservaForm').onsubmit = async (e) => {
    e.preventDefault();

    const datos = {
        nombre: document.getElementById('nombre').value,
        fecha: document.getElementById('fechaInput').value,
        hora_inicio: document.getElementById('inicio').value,
        hora_fin: document.getElementById('fin').value
    };

    if (!validarFormulario(datos)) return;

    const btnGuardar = document.querySelector('#reservaForm button[type="submit"]');
    const textoOriginal = btnGuardar.innerHTML;
    btnGuardar.disabled = true;
    btnGuardar.innerHTML = `<span class="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span> Guardando...`;

    try {
        let res;
        if (reservaSeleccionadaId) {
            res = await fetch(`/reservas/${reservaSeleccionadaId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(datos)
            });
        } else {
            res = await fetch("/reservas", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(datos)
            });
        }

        if (!res.ok) {
            const data = await res.json();
            throw new Error(data.error || `Error ${res.status}`);
        }

        closeModal();
        calendar.refetchEvents();
        Swal.fire({
            title: '¡Guardado!',
            text: 'La reserva se creó correctamente',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false,
            confirmButtonColor: '#39A900'
        });
    } catch (error) {
        mostrarError(error.message);
    } finally {
        btnGuardar.disabled = false;
        btnGuardar.innerHTML = textoOriginal;
    }
};

async function eliminarReserva() {
    if (!reservaSeleccionadaId) return;

    const result = await Swal.fire({
        title: '¿Eliminar reserva?',
        text: 'Esta acción no se puede deshacer',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#6b7280'
    });

    if (result.isConfirmed) {
        try {
            const res = await fetch(`/reservas/${reservaSeleccionadaId}`, {
                method: "DELETE"
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Error al eliminar');
            }

            closeModal();
            calendar.refetchEvents();
            Swal.fire({
                title: 'Eliminado',
                icon: 'success',
                timer: 1500,
                showConfirmButton: false
            });
        } catch (error) {
            mostrarError(error.message);
        }
    }
}
