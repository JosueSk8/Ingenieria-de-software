document.addEventListener('DOMContentLoaded', () => {
    const listaEstudiantes = document.getElementById('listaEstudiantes');
    const formEquipo = document.getElementById('formEquipo');
    const botonCrear = formEquipo.querySelector('button[type="submit"]');
    const mensaje = document.getElementById('mensaje');

    async function cargarEstudiantes() {
        try {
            // Obtener todos los estudiantes
            const resEst = await fetch('http://localhost:3000/estudiantes');
            if (!resEst.ok) throw new Error("No se pudo cargar la lista de estudiantes");
            const estudiantes = await resEst.json();

            // Obtener todos los equipos
            const resEq = await fetch('http://localhost:3000/equipos');
            if (!resEq.ok) throw new Error("No se pudo cargar la lista de equipos");
            const equipos = await resEq.json();

            // Obtener IDs de estudiantes ya asignados a equipos
            const estudiantesAsignados = new Set();
            equipos.forEach(eq => {
                if (Array.isArray(eq.integrantes || eq.estudiantes)) {
                    (eq.integrantes || eq.estudiantes).forEach(id => estudiantesAsignados.add(id));
                }
            });

            // Limpiar y mostrar solo los estudiantes disponibles
            listaEstudiantes.innerHTML = '';
            let disponibles = 0;

            estudiantes.forEach(est => {
                if (!estudiantesAsignados.has(est._id)) {
                    const div = document.createElement('div');
                    div.classList.add('checkboxEstudiante');

                    const checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.name = 'estudiantes';
                    checkbox.value = est._id;
                    checkbox.id = `estudiante-${est._id}`;

                    const label = document.createElement('label');
                    label.htmlFor = checkbox.id;
                    label.textContent = est.nombre || est.nombreCompleto || "Nombre desconocido";

                    div.appendChild(checkbox);
                    div.appendChild(label);
                    listaEstudiantes.appendChild(div);

                    checkbox.addEventListener('change', validarSeleccion);
                    disponibles++;
                }
            });

            if (disponibles === 0) {
                listaEstudiantes.innerHTML = '<p>No hay estudiantes disponibles para asignar.</p>';
            }

            validarSeleccion();
        } catch (error) {
            listaEstudiantes.innerHTML = 'Error cargando estudiantes.';
            console.error(error);
        }
    }

    function validarSeleccion() {
        const seleccionados = formEquipo.querySelectorAll('input[name="estudiantes"]:checked').length;
        botonCrear.disabled = !(seleccionados >= 1 && seleccionados <= 4);
        mensaje.textContent = '';
    }

    formEquipo.addEventListener('submit', async e => {
        e.preventDefault();

        const nombreEquipo = formEquipo.nombreEquipo.value.trim();
        const estudiantesSeleccionados = Array.from(formEquipo.querySelectorAll('input[name="estudiantes"]:checked'))
            .map(chk => chk.value);

        if (estudiantesSeleccionados.length < 1 || estudiantesSeleccionados.length > 4) {
            mensaje.textContent = 'Selecciona entre 1 y 4 estudiantes.';
            mensaje.style.color = 'red';
            return;
        }

        const nuevoEquipo = {
            nombre: nombreEquipo,
            estudiantes: estudiantesSeleccionados
        };

        try {
            const res = await fetch('http://localhost:3000/equipos/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(nuevoEquipo)
            });

            if (!res.ok) {
                const error = await res.text();
                throw new Error(error || "Error al crear el equipo");
            }

            alert('Equipo creado correctamente.');
            mensaje.textContent = 'Equipo creado correctamente.';
            mensaje.style.color = 'green';
            formEquipo.reset();
            cargarEstudiantes(); // recargar para reflejar cambios
        } catch (error) {
            mensaje.textContent = error.message;
            mensaje.style.color = 'red';
        }
    });

    cargarEstudiantes();
});
function cerrarSesion() {
    window.location.href = "../index.html";
}