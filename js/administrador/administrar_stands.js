document.addEventListener("DOMContentLoaded", () => {
    const tabla = document.querySelector("#tablaStands tbody");

    function cargarStands() {
        fetch("http://localhost:3000/stands")
            .then(res => res.json())
            .then(data => {
                tabla.innerHTML = "";
                data.forEach(stand => {
                    const fila = document.createElement("tr");
                    fila.innerHTML = `
                        <td>${stand.edificio}</td>
                        <td>${stand.mesa}</td>
                        <td>
                            <button class="btn-eliminar" onclick="eliminarStand('${stand._id}')">Eliminar</button>
                        </td>
                    `;
                    tabla.appendChild(fila);
                });
            })
            .catch(err => console.error("Error al cargar stands:", err));
    }

    window.eliminarStand = function(id) {
        if (!confirm("¿Deseas eliminar este stand?")) return;

        fetch(`http://localhost:3000/stands/${id}`, {
            method: "DELETE"
        })
            .then(res => {
                if (res.ok) {
                    cargarStands();
                } else {
                    alert("Error al eliminar el stand.");
                }
            });
    };

    cargarStands();
});

function cerrarSesion() {
    localStorage.clear();
    window.location.href = '../index.html';
}
