document.addEventListener('DOMContentLoaded', async () => {
    const estudianteId = localStorage.getItem('estudianteId');
    const container = document.getElementById('proyecto');
    if (!estudianteId) {
        container.innerHTML = '<p>Inicia sesión para registrar tu proyecto.</p>';
        return;
    }

    try {
        const resEquipo = await fetch(`http://localhost:3000/equipos/estudiante/${estudianteId}`);
        if (!resEquipo.ok) throw new Error('No se pudo obtener el equipo');

        const equipo = await resEquipo.json();
        const equipoId = equipo._id;
        let nombreEvaluador = 'No evaluado';
        if (equipo.evaluadorId) {
            try {
                const resEval = await fetch(`http://localhost:3000/evaluadores/${equipo.evaluadorId}`);
                if (resEval.ok) {
                    const evaluador = await resEval.json();
                    nombreEvaluador = evaluador.nombre;
                }
            } catch (err) {
                console.error('Error al obtener nombre del evaluador', err);
            }
        }
        if (equipo.proyecto) {
            const { nombre, descripcion, repositorio } = equipo.proyecto;
            const calificacion = equipo.calificacion ?? 'No calificado';
            const comentario = equipo.comentario ?? 'Sin comentarios';

            container.innerHTML = `
    <div class="proyecto-container">
        <h3 class="titulo-proyecto">Proyecto registrado</h3>

        <div class="proyecto-campo">
            <h4>Nombre del Proyecto:</h4>
            <p>${nombre}</p>
        </div>

        <div class="proyecto-campo">
            <h4>Descripción:</h4>
            <p>${descripcion}</p>
        </div>

        <div class="proyecto-campo">
            <h4>Repositorio:</h4>
            <p><a href="${repositorio}" target="_blank">${repositorio}</a></p>
        </div>
        
        <div class="proyecto-campo">
            <h4>Nombre del evaluador:</h4>
            <p>${nombreEvaluador}</p>
        </div>

        <div class="proyecto-campo">
            <h4>Calificación del evaluador:</h4>
            <p>${calificacion}</p>
        </div>

        <div class="proyecto-campo">
            <h4>Comentario del evaluador:</h4>
            <p>${comentario}</p>
        </div>

        <button id="btnEditar" class="btn-editar">Editar Proyecto</button>

        <div id="formEditar" class="formulario-edicion d-none">
            <form id="formProyecto">
                <div class="proyecto-campo">
                    <label class="form-label">Nombre del proyecto:</label>
                    <input type="text" id="nombre" value="${nombre}" class="form-control" required>
                </div>

                <div class="proyecto-campo">
                    <label class="form-label">Descripción:</label>
                    <textarea id="descripcion" class="form-control" rows="4" required>${descripcion}</textarea>
                </div>

                <div class="proyecto-campo">
                    <label class="form-label">Repositorio:</label>
                    <input type="url" id="repositorio" value="${repositorio}" class="form-control" required>
                </div>

                <button type="submit" class="btn-actualizar">Actualizar Proyecto</button>
                <button type="button" id="btnEliminar" class="btn-eliminar">Eliminar Proyecto</button>

            </form>
        </div>
    </div>
    `;

            const btnEditar = document.getElementById('btnEditar');
            const formEditar = document.getElementById('formEditar');

            btnEditar.addEventListener('click', () => {
                formEditar.classList.remove('d-none');
                btnEditar.classList.add('d-none');
            });

            const form = document.getElementById('formProyecto');
            form.addEventListener('submit', async (e) => {
                e.preventDefault();

                const nuevoNombre = document.getElementById('nombre').value.trim();
                const nuevaDescripcion = document.getElementById('descripcion').value.trim();
                const nuevoRepositorio = document.getElementById('repositorio').value.trim();

                const res = await fetch(`http://localhost:3000/equipos/${equipo._id}/proyecto`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        nombre: nuevoNombre,
                        descripcion: nuevaDescripcion,
                        repositorio: nuevoRepositorio
                    })
                });

                if (res.ok) {
                    alert('Proyecto actualizado correctamente');
                    location.reload();
                } else {
                    alert('Error al actualizar el proyecto');
                }
            });

            const btnEliminar = document.getElementById('btnEliminar');
            btnEliminar.addEventListener('click', async () => {
                const confirmacion = confirm("¿Estás seguro de que deseas eliminar el proyecto?");
                if (!confirmacion) return;

                try {
                    const res = await fetch(`http://localhost:3000/equipos/${equipo._id}/proyecto`, {
                        method: 'DELETE'
                    });

                    if (res.ok) {
                        alert("Proyecto eliminado correctamente");
                        location.reload();
                    } else {
                        alert("No se pudo eliminar el proyecto");
                    }
                } catch (err) {
                    console.error(err);
                    alert("Error al eliminar el proyecto");
                }
            });


        } else {
                // Mostrar formulario para registrar nuevo proyecto
                container.innerHTML = `
        <div class="proyecto-container">
            <h3 class="titulo-proyecto">Registrar nuevo proyecto</h3>
            <form id="formProyecto">
                <div class="proyecto-campo">
                    <label class="form-label">Nombre del proyecto:</label>
                    <input type="text" id="nombre" class="form-control" required>
                </div>

                <div class="proyecto-campo">
                    <label class="form-label">Descripción:</label>
                    <textarea id="descripcion" class="form-control" rows="4" required></textarea>
                </div>

                <div class="proyecto-campo">
                    <label class="form-label">Repositorio:</label>
                    <input type="url" id="repositorio" class="form-control" required>
                </div>

                <button type="submit" class="btn-actualizar">Registrar Proyecto</button>
            </form>
        </div>
    `;

                const form = document.getElementById('formProyecto');
                form.addEventListener('submit', async (e) => {
                    e.preventDefault();

                    const nombre = document.getElementById('nombre').value.trim();
                    const descripcion = document.getElementById('descripcion').value.trim();
                    const repositorio = document.getElementById('repositorio').value.trim();

                    const res = await fetch(`http://localhost:3000/equipos/${equipoId}/proyecto`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ nombre, descripcion, repositorio })
                    });

                    if (res.ok) {
                        alert('Proyecto registrado correctamente');
                        location.reload();
                    } else if (res.status === 409) {
                        alert('Ya existe un proyecto para este equipo');
                    } else {
                        alert('Error al registrar el proyecto');
                    }
                });
            }


        } catch (error) {
        console.error(error);
        container.innerHTML = '<p>Error al cargar el proyecto.</p>';
    }
});


function cerrarSesion() {
    window.location.href = "../index.html";
}