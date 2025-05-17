document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const evaluadorId = params.get('id');

    if (!evaluadorId) {
        document.getElementById('perfil').innerHTML = "<p>Error: ID de evaluador no proporcionado.</p>";
        return;
    }

    try {
        const res = await fetch(`http://localhost:3000/evaluadores/${evaluadorId}`);

        if (!res.ok) {
            throw new Error("No se pudo cargar el perfil");
        }

        const evaluador = await res.json();

        document.getElementById('perfil').innerHTML = `
            <p><strong>Nombre:</strong> ${evaluador.nombre}</p>
            <p><strong>Correo:</strong> ${evaluador.correo}</p>
            <p><strong>Área de Evaluación:</strong> ${evaluador.area}</p>
        `;
    } catch (error) {
        document.getElementById('perfil').innerHTML = `<p>Error al cargar el perfil: ${error.message}</p>`;
    }
});

function cerrarSesion() {
    window.location.href = "../index.html";
}
