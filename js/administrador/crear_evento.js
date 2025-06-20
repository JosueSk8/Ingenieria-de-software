document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("formEvento");
    const resultado = document.getElementById("resultado");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const nombre = form.nombre.value.trim();
        const fechaInicio = form.fechaInicio.value;
        const fechaFin = form.fechaFin.value;
        const horaInicio = form.horaInicio.value;

        // Validación de fechas
        if (fechaInicio > fechaFin) {
            resultado.textContent = " La fecha de inicio no puede ser posterior a la fecha de finalización.";
            return;
        }

        const evento = { nombre, fechaInicio, fechaFin, horaInicio };

        try {
            const res = await fetch("http://localhost:3000/eventos/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(evento)
            });

            if (res.status === 201) {
                resultado.textContent = " Evento registrado correctamente.";
                form.reset();
            } else {
                resultado.textContent = " Error al registrar el evento.";
            }
        } catch (err) {
            console.error(err);
            resultado.textContent = " Error de conexión con el servidor.";
        }
    });
});

function cerrarSesion() {
    localStorage.clear();
    window.location.href = '../../login.html';
}
