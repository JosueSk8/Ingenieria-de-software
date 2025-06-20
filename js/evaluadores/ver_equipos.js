document.addEventListener('DOMContentLoaded', async () => {
    const contenedor = document.getElementById('contenedor-equipos');

    try {
        const res = await fetch('http://localhost:3000/evaluador/equipos-proyectos');
        const equipos = await res.json();
        contenedor.innerHTML = equipos.map(equipo => {
            const proyecto = equipo.proyecto;
            const tieneEvaluacion = equipo.calificacion || equipo.comentario || equipo.evaluadorId;

            return `
    <div class="equipo-box">
        <h3>${equipo.nombre}</h3>

        <h4>Integrantes:</h4>
        <ul>
            ${equipo.integrantes.map(nombre => `<li>${nombre}</li>`).join('')}
        </ul>
        
        ${proyecto ? `
            <p><strong>Proyecto:</strong> ${proyecto.nombre}</p>
            <p><strong>Descripción:</strong> ${proyecto.descripcion}</p>
            <p><strong>Repositorio:</strong> <a href="${proyecto.repositorio}" target="_blank">${proyecto.repositorio}</a></p>
        ` : '<p><em>Sin proyecto registrado</em></p>'}

        <label>Calificación:</label>
        <input type="number" id="calificacion-${equipo._id}" value="${equipo.calificacion || ''}" min="0" max="100">

        <label>Comentario:</label>
        <textarea id="comentario-${equipo._id}">${equipo.comentario || ''}</textarea>

        <button onclick="guardarEvaluacion('${equipo._id}')">Guardar</button>

        ${tieneEvaluacion ? `<button onclick="eliminarEvaluacion('${equipo._id}')">Eliminar evaluación</button>` : ''}
    </div>
    `;
        }).join('');


    } catch (err) {
        console.error(err);
        contenedor.innerHTML = '<p>Error al cargar los equipos.</p>';

    }
});

async function guardarEvaluacion(equipoId) {
    const calificacion = document.getElementById(`calificacion-${equipoId}`).value;
    const comentario = document.getElementById(`comentario-${equipoId}`).value;
    const evaluadorId = localStorage.getItem('evaluadorId')
    try {
        const res = await fetch(`http://localhost:3000/evaluador/calificar/${equipoId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ calificacion, comentario, evaluadorId })
        });

        if (!res.ok) throw new Error('No se pudo guardar');
        alert('Calificación guardada');
    } catch (err) {
        console.error(err);
        alert('Error al guardar calificación');
    }
}

async function eliminarEvaluacion(equipoId) {
    const confirmacion = confirm("¿Estás seguro de que deseas eliminar la evaluación?");
    if (!confirmacion) return;

    try {
        const res = await fetch(`http://localhost:3000/evaluador/calificar/${equipoId}`, {
            method: 'DELETE'
        });

        if (!res.ok) throw new Error('No se pudo eliminar');
        alert('Evaluación eliminada');
        location.reload();
    } catch (err) {
        console.error(err);
        alert('Error al eliminar evaluación');
    }
}

function cerrarSesion() {
    window.location.href = "../index.html";
}
