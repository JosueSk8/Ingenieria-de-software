document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("formStand");
    const mesaSelect = document.getElementById("mesa");
    const resultado = document.getElementById("resultado");

    // Cargar mesas del 1 al 20
    for (let i = 1; i <= 20; i++) {
        const option = document.createElement("option");
        option.value = i;
        option.textContent = `Mesa ${i}`;
        mesaSelect.appendChild(option);
    }

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const edificio = parseInt(form.edificio.value);
        const mesa = parseInt(form.mesa.value);

        const stand = {
            edificio,
            mesa,
            ubicacion: `Edificio ${edificio} - Mesa ${mesa}`,
            fechaRegistro: new Date().toISOString()
        };

        try {
            const res = await fetch("http://localhost:3000/stands/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(stand)
            });

            if (res.status === 201) {
                resultado.textContent = " Stand registrado con éxito.";
                form.reset();
            } else if (res.status === 409) {
                resultado.textContent = "⚠ Ya existe un stand con ese edificio y mesa.";
            } else {
                resultado.textContent = " Error al registrar el stand.";
            }
        } catch (err) {
            console.error(err);
            resultado.textContent = " Error de conexión con el servidor.";
        }
    });
});

function cerrarSesion() {
    localStorage.clear();
    window.location.href = '../index.html';
}
