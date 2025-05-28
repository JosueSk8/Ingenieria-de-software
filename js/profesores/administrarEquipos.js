document.addEventListener('DOMContentLoaded', () => {
    const equipoSelect = document.getElementById('equipoSelect');
    const nombreEquipoInput = document.getElementById('nombreEquipo');
    const listaEstudiantes = document.getElementById('listaEstudiantes');
    const formEditarEquipo = document.getElementById('formEditarEquipo');
    const eliminarBtn = document.getElementById('eliminarEquipo');
    const mensaje = document.getElementById('mensaje');

    let estudiantes = [];
    let equipos = [];

    async function cargarDatos() {
        try {
            const [resEst, resEq] = await Promise.all([
                fetch('http://localhost:3000/estudiantes'),
                fetch('http://localhost:3000/equipos')
            ]);

            if (!resEst.ok || !resEq.ok) throw new Error("Error cargando datos");

            estudiantes = await resEst.json();
            equipos = await resEq.json();

            equipoSelect.innerHTML = '';
            equipos.forEach(eq => {
                const option = document.createElement('option');
                option.value = eq._id;
                option.textContent = eq.nombre;
                equipoSelect.appendChild(option);
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
                    estudiantes: estudiantesSeleccionados
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