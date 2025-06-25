document.addEventListener('DOMContentLoaded', () => {
    const equipoSelect = document.getElementById('equipoSelect');
    const nombreEquipoInput = document.getElementById('nombreEquipo');
    const listaEstudiantes = document.getElementById('listaEstudiantes');
    const formEditarEquipo = document.getElementById('formEditarEquipo');
    const eliminarBtn = document.getElementById('eliminarEquipo');
    const standSelect = document.getElementById('standSelect');
    const mensaje = document.getElementById('mensaje');

    let estudiantes = [];
    let equipos = [];
    let stands = [];

    async function cargarDatos() {
        try {
            const [resEst, resEq, resSt] = await Promise.all([
                fetch('http://localhost:3000/estudiantes'),
                fetch('http://localhost:3000/equipos'),
                fetch('http://localhost:3000/stands')
            ]);

            if (!resEst.ok || !resEq.ok || !resSt.ok) throw new Error("Error cargando datos");

            estudiantes = await resEst.json();
            equipos = await resEq.json();
            stands = await resSt.json();

            equipoSelect.innerHTML = '';
            equipos.forEach(eq => {
                const option = document.createElement('option');
                option.value = eq._id;
                option.textContent = eq.nombre;
                equipoSelect.appendChild(option);
            });

             // Obtener IDs de stands ya asignados a otros equipos excepto el seleccionado
        const equipoIdActual = equipoSelect.value;
        const standsAsignados = new Set();
        equipos.forEach(eq => {
            if (eq.standId && eq._id !== equipoIdActual) {
                standsAsignados.add(eq.standId);
            }
        });

        // Cargar opciones stands filtrando los ya asignados
        standSelect.innerHTML = '<option value="">-- Selecciona un stand --</option>';
        stands.forEach(stand => {
            if (!standsAsignados.has(stand._id)) {
                const option = document.createElement('option');
                option.value = stand._id;
                option.textContent = stand.ubicacion || `Edificio ${stand.edificio} - Mesa ${stand.mesa}`;
                standSelect.appendChild(option);
            }
        });


            mostrarEquipoSeleccionado();
        } catch (err) {
            mensaje.textContent = "Error al cargar datos.";
            console.error(err);
        }
    }

    function mostrarEquipoSeleccionado() {
        const equipoId = equipoSelect.value;
        const equipo = equipos.find(eq => eq._id === equipoId);
        if (!equipo) return;

        nombreEquipoInput.value = equipo.nombre;

        // Seleccionar stand asignado si hay
        if (equipo.standId) {
            standSelect.value = equipo.standId;
        } else {
            standSelect.value = '';
        }

        // Recalcular estudiantes asignados globalmente
        const asignadosGlobal = new Set();
        equipos.forEach(eq => {
            if (eq._id !== equipoId && Array.isArray(eq.estudiantes)) {
                eq.estudiantes.forEach(id => asignadosGlobal.add(id));
            }
        });

        listaEstudiantes.innerHTML = '';
        estudiantes.forEach(est => {
            const div = document.createElement('div');
            div.classList.add('checkboxEstudiante');

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.name = 'estudiantes';
            checkbox.value = est._id;
            checkbox.id = `est-${est._id}`;

            // Mostrar sólo los no asignados o los que ya estaban en este equipo
            if (!asignadosGlobal.has(est._id) || (equipo.estudiantes || []).includes(est._id)) {
                checkbox.checked = (equipo.estudiantes || []).includes(est._id);

                const label = document.createElement('label');
                label.htmlFor = checkbox.id;
                label.textContent = est.nombre || "Nombre desconocido";

                div.appendChild(checkbox);
                div.appendChild(label);
                listaEstudiantes.appendChild(div);
            }
        });
    }

    equipoSelect.addEventListener('change', mostrarEquipoSeleccionado);

    formEditarEquipo.addEventListener('submit', async e => {
        e.preventDefault();

        const equipoId = equipoSelect.value;
        const nuevoNombre = nombreEquipoInput.value.trim();
        const estudiantesSeleccionados = Array.from(
            listaEstudiantes.querySelectorAll('input[name="estudiantes"]:checked')
        ).map(chk => chk.value);
        const standId = standSelect.value || null;


        if (estudiantesSeleccionados.length < 1 || estudiantesSeleccionados.length > 4) {
            mensaje.textContent = "Selecciona entre 1 y 4 estudiantes.";
            mensaje.style.color = 'red';
            return;
        }
    

        try {
            const res = await fetch(`http://localhost:3000/equipos/${equipoId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nombre: nuevoNombre,
                    estudiantes: estudiantesSeleccionados,
                    standId: standId
                })
            });

            if (!res.ok) throw new Error("Error al actualizar equipo");

            mensaje.textContent = "Equipo actualizado correctamente.";
            mensaje.style.color = 'green';

            await cargarDatos(); // Refrescar datos
        } catch (err) {
            mensaje.textContent = err.message;
            mensaje.style.color = 'red';
        }
    });

    eliminarBtn.addEventListener('click', async () => {
        const equipoId = equipoSelect.value;
        if (!confirm("¿Estás seguro de eliminar este equipo?")) return;

        try {
            const res = await fetch(`http://localhost:3000/equipos/${equipoId}`, {
                method: 'DELETE'
            });

            if (!res.ok) throw new Error("Error al eliminar el equipo");

            mensaje.textContent = "Equipo eliminado correctamente.";
            mensaje.style.color = 'green';

            await cargarDatos();
        } catch (err) {
            mensaje.textContent = err.message;
            mensaje.style.color = 'red';
        }
    });

    cargarDatos();
});
function cerrarSesion() {
    window.location.href = "../index.html";
}
