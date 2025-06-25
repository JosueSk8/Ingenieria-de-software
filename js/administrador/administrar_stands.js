document.addEventListener("DOMContentLoaded", () => {
    const tabla = document.querySelector("#tablaStands tbody");

    async function cargarStandsConEquipo() {
        try {
            const resStands = await fetch("http://localhost:3000/stands");
            const stands = await resStands.json();

            // Obtener todos los equipos para relacionarlos con stands
            const resEquipos = await fetch("http://localhost:3000/equipos");
            const equipos = await resEquipos.json();

            tabla.innerHTML = "";

            stands.forEach(stand => {
                // Buscar equipo que tenga este stand asignado
                const equipoAsignado = equipos.find(e => e.standId === stand._id);

                const nombreEquipo = equipoAsignado ? equipoAsignado.nombre : "No asignado";

                const fila = document.createElement("tr");
                fila.innerHTML = `
                    <td>${stand.edificio}</td>
                    <td>${stand.mesa}</td>
                    <td>${nombreEquipo}</td>
                    <td>
                        <button class="btn-eliminar" onclick="eliminarStand('${stand._id}')">Eliminar</button>
                    </td>
                `;
                tabla.appendChild(fila);
            });

        } catch (error) {
            console.error("Error al cargar stands y equipos:", error);
        }
    }

   window.eliminarStand = async function(id) {
        if (!confirm("¿Deseas eliminar este stand?")) return;

        try {
            const res = await fetch(`http://localhost:3000/stands/${id}`, { method: "DELETE" });
            if (res.ok) {
                cargarStandsConEquipo();
            } else {
                alert("Error al eliminar el stand.");
            }
        } catch {
            alert("Error al eliminar el stand.");
        }
    };

    cargarStandsConEquipo();
});

function cerrarSesion() {
    localStorage.clear();
    window.location.href = '../index.html';
}
