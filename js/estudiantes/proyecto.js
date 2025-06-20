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

        if (equipo.proyecto) {
            const { nombre, descripcion, repositorio } = equipo.proyecto;

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
            <h4>Repositorio: </h4>
            <p><a href="${repositorio}" target="_blank">${repositorio}</a></p>
        </div>

        <button id="btnEditar" class="btn-editar"> Editar Proyecto</button>

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

                <button type="submit" class="btn-actualizar"> Actualizar Proyecto</button>
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
        }

    } catch (error) {
        console.error(error);
        container.innerHTML = '<p>Error al cargar el proyecto.</p>';
    }
});


function cerrarSesion() {
    window.location.href = "../index.html";
}