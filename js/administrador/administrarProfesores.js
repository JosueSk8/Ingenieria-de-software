const API_URL = 'http://localhost:3000/profesores';

async function cargarProfesores() {
    const response = await fetch(API_URL);
    const profesores = await response.json();
    const tbody = document.querySelector('#tablaProfesores tbody');
    tbody.innerHTML = '';

    profesores.forEach(prof => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
      <td contenteditable="true">${prof.nombre || ''}</td>
      <td contenteditable="true">${prof.departamento || ''}</td>
      <td contenteditable="true">${prof.correo || ''}</td>
      <td>
        <button class="btn-guardar" onclick="guardarProfesor('${prof._id}', this)">Guardar</button>
        <button class="btn-eliminar" onclick="eliminarProfesor('${prof._id}')">Eliminar</button>
      </td>
    `;
        tbody.appendChild(tr);
    });
}

async function eliminarProfesor(id) {
    if (confirm('¿Estás seguro de eliminar este profesor?')) {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        cargarProfesores();
    }
}

async function guardarProfesor(id, boton) {
    const fila = boton.closest('tr');
    const nombre = fila.children[0].textContent.trim();
    const departamento = fila.children[1].textContent.trim();
    const correo = fila.children[2].textContent.trim();

    await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, departamento, correo })
    });

    alert('Profesor actualizado');
}
function cerrarSesion() {
    window.location.href = "../index.html";
}


cargarProfesores();