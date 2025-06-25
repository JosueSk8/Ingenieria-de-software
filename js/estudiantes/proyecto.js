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

    // Obtener info del stand si está asignado
    let infoStand = 'No asignado';
    if (equipo.standId) {
        try {
            const resStand = await fetch(`http://localhost:3000/stands/${equipo.standId}`);
            if (resStand.ok) {
                const stand = await resStand.json();
                infoStand = stand.ubicacion || `Edificio ${stand.edificio} - Mesa ${stand.mesa}`;
            }
        } catch (err) {
            console.error('Error al obtener info del stand', err);
            infoStand = 'Error al obtener información del stand';
        }
    }

    container.innerHTML = `
        <h3 class="titulo-proyecto">Proyecto registrado</h3>

        <div class="card-perfil">
          <i class="fas fa-file-signature"></i>
          <span><strong>Nombre del Proyecto:</strong> ${nombre}</span>
        </div>

        <div class="card-perfil">
          <i class="fas fa-align-left"></i>
          <span><strong>Descripción:</strong> ${descripcion}</span>
        </div>

        <div class="card-perfil">
          <i class="fas fa-code-branch"></i>
          <span><strong>Repositorio:</strong> <a href="${repositorio}" target="_blank" style="color: #ffcb05;">${repositorio}</a></span>
        </div>

        <div class="card-perfil">
          <i class="fas fa-user-check"></i>
          <span><strong>Evaluador:</strong> ${nombreEvaluador}</span>
        </div>

        <div class="card-perfil">
          <i class="fas fa-map-marker-alt"></i>
          <span><strong>Stand asignado:</strong> ${infoStand}</span>
        </div>

        <div class="card-perfil">
          <i class="fas fa-star"></i>
          <span><strong>Calificación:</strong> ${calificacion}</span>
        </div>

        <div class="card-perfil">
          <i class="fas fa-comment"></i>
          <span><strong>Comentario:</strong> ${comentario}</span>
        </div>

  <div class="form-btn-container">
    <button id="btnEditar" class="custom-button"><i class="fas fa-edit"></i> Editar Proyecto</button>
  </div>

  <div id="formEditar" class="formulario-edicion d-none">
    <form id="formProyecto" class="form-proyecto">
      <div class="form-campos">
        <div class="card-perfil">
          <i class="fas fa-file-signature"></i>
          <span><strong>Nombre:</strong></span>
          <input type="text" id="nombre" value="${nombre}" class="form-control" required>
        </div>

        <div class="card-perfil">
          <i class="fas fa-align-left"></i>
          <span><strong>Descripción:</strong></span>
          <textarea id="descripcion" class="form-control" rows="3" required>${descripcion}</textarea>
        </div>

        <div class="card-perfil">
          <i class="fas fa-code-branch"></i>
          <span><strong>Repositorio:</strong></span>
          <input type="url" id="repositorio" value="${repositorio}" class="form-control" required>
        </div>
      </div>

      <div class="form-btn-container">
        <button type="submit" class="btn-actualizar"><i class="fas fa-sync-alt"></i> Actualizar</button>
        <button type="button" id="btnEliminar" class="btn-eliminar"><i class="fas fa-trash-alt"></i> Eliminar</button>
      </div>
    </form>
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
    <div class="card-foto">
        <i class="fas fa-folder-plus fa-3x"></i>
        <p>Registrar nuevo proyecto</p>
    </div>

    <form id="formProyecto" class="form-proyecto">
        <div class="form-campos">
            <div class="card-perfil">
                <i class="fas fa-file-signature"></i>
                <span><strong>Nombre del proyecto:</strong></span>
                <input type="text" id="nombre" class="form-control" required>
            </div>

            <div class="card-perfil">
                <i class="fas fa-align-left"></i>
                <span><strong>Descripción:</strong></span>
                <textarea id="descripcion" class="form-control" rows="3" required></textarea>
            </div>

            <div class="card-perfil">
                <i class="fas fa-code-branch"></i>
                <span><strong>Repositorio:</strong></span>
                <input type="url" id="repositorio" class="form-control" required>
            </div>
        </div>

        <div class="form-btn-container">
            <button type="submit" class="btn-actualizar">
                <i class="fas fa-paper-plane"></i> Registrar Proyecto
            </button>
        </div>
    </form>
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