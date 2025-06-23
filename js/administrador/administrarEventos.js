document.addEventListener("DOMContentLoaded", () => {
    const tabla = document.querySelector("#tablaEventos tbody");

    function cargarEventos() {
        fetch("http://localhost:3000/eventos")
            .then(res => res.json())
            .then(data => {
                tabla.innerHTML = "";
                data.forEach(evento => {
                    const fila = document.createElement("tr");
                    fila.innerHTML = `
                        <td contenteditable="true" data-campo="nombre">${evento.nombre}</td>
                        <td><input type="date" value="${evento.fechaInicio}" data-campo="fechaInicio"></td>
                        <td><input type="date" value="${evento.fechaFin}" data-campo="fechaFin"></td>
                        <td><input type="time" value="${evento.horaInicio}" data-campo="horaInicio"></td>
                        <td>
                            <button class="btn-guardar" onclick="guardarCambios('${evento._id}', this)">Guardar</button>
                            <button class="btn-eliminar" onclick="eliminarEvento('${evento._id}')">Eliminar</button>
                        </td>
                    `;
                    tabla.appendChild(fila);
                });
            })
            .catch(err => console.error("Error al cargar eventos:", err));
    }

    window.guardarCambios = function (id, boton) {
        const fila = boton.closest("tr");
        const datosActualizados = {};

        fila.querySelectorAll("[data-campo]").forEach(el => {
            const campo = el.getAttribute("data-campo");
            datosActualizados[campo] = el.tagName === "INPUT" ? el.value : el.innerText.trim();
        });

        // Validación de fechas
        if (datosActualizados.fechaInicio > datosActualizados.fechaFin) {
            alert(" La fecha de inicio no puede ser posterior a la fecha de finalización.");
            return;
        }

        fetch(`http://localhost:3000/eventos/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datosActualizados)
        })
            .then(res => {
                if (res.ok) {
                    alert(" Evento actualizado");
                    cargarEventos();
                } else {
                    alert(" Error al guardar los cambios");
                }
            });
    };

    window.eliminarEvento = function (id) {
        if (!confirm("¿Deseas eliminar este evento?")) return;

        fetch(`http://localhost:3000/eventos/${id}`, {
            method: "DELETE"
        })
            .then(res => {
                if (res.ok) {
                    cargarEventos();
                } else {
                    alert("Error al eliminar el evento.");
                }
            });
    };

    cargarEventos();
});

function cerrarSesion() {
    localStorage.clear();
    window.location.href = '../index.html';
}
