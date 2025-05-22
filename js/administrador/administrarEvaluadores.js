const API_URL = 'http://localhost:3000/evaluadores';

async function cargarEvaluadores() {
    const response = await fetch(API_URL);
    const evaluadores = await response.json();
    const tbody = document.querySelector('#tablaEvaluadores tbody');
    tbody.innerHTML = '';

    evaluadores.forEach(evaluador => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
      <td contenteditable="true">${evaluador.nombre || ''}</td>
      <td contenteditable="true">${evaluador.area || ''}</td>
      <td contenteditable="true">${evaluador.correo || ''}</td>
      <td>
        <button class="btn-guardar" onclick="guardarEvaluador('${evaluador._id}', this)">Guardar</button>
        <button class="btn-eliminar" onclick="eliminarEvaluador('${evaluador._id}')">Eliminar</button>
      </td>
    `;
        tbody.appendChild(tr);
    });
}

async function eliminarEvaluador(id) {
    if (confirm('¿Estás seguro de eliminar este evaluador?')) {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        cargarEvaluadores();
    }
}

async function guardarEvaluador(id, boton) {
    const fila = boton.closest('tr');
    const nombre = fila.children[0].textContent.trim();
    const area = fila.children[1].textContent.trim();
    const correo = fila.children[2].textContent.trim();

    await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, area, correo })
    });

    alert('Evaluador actualizado');
}
function cerrarSesion() {
    window.location.href = "../index.html";
}


cargarEvaluadores();