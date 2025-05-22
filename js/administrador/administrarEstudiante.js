const API_URL = 'http://localhost:3000/estudiantes';

async function cargarEstudiantes() {
    const response = await fetch(API_URL);
    const estudiantes = await response.json();

    const tbody = document.querySelector('#tablaEstudiantes tbody');
    tbody.innerHTML = '';

    estudiantes.forEach(est => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td contenteditable="true">${est.nombre || ''}</td>
            <td contenteditable="true">${est.correo || ''}</td>
            <td contenteditable="true">${est.boleta || ''}</td>
            <td contenteditable="true">${est.carrera || ''}</td>
            <td>
                <button class="btn-guardar" onclick="guardarEstudiante('${est._id}', this)">Guardar</button>
                <button class="btn-eliminar" onclick="eliminarEstudiante('${est._id}')">Eliminar</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

async function eliminarEstudiante(id) {
    if (confirm('¿Estás seguro de que deseas eliminar este estudiante?')) {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        cargarEstudiantes();
    }
}

async function guardarEstudiante(id, boton) {
    const fila = boton.closest('tr');
    const nombre = fila.children[0].textContent.trim();
    const correo = fila.children[1].textContent.trim();
    const boleta = fila.children[2].textContent.trim();
    const carrera = fila.children[3].textContent.trim();

    await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, correo, boleta, carrera })
    });

    alert('Estudiante actualizado');
}
function cerrarSesion() {
    window.location.href = "../index.html";
}


cargarEstudiantes();