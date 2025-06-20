document.addEventListener('DOMContentLoaded', async () => {
    const estudianteId = localStorage.getItem('estudianteId');

    if (!estudianteId) {
        document.getElementById('perfil').innerHTML = "<p>Error: ID de estudiante no proporcionado.</p>";
        return;
    }

    try {
        const res = await fetch(`http://localhost:3000/estudiantes/${estudianteId}`);

        if (!res.ok) {
            throw new Error("No se pudo cargar el perfil");
        }

        const estudiante = await res.json();

        document.getElementById('perfil').innerHTML = `
            <h2>Información del estudiante:</h2><br>
            <div class="perfil-dato">
                <strong>Nombre:</strong>
                <p>${estudiante.nombre}</p>
            </div>
            <div class="perfil-dato">
                <strong>Correo:</strong>
                <p>${estudiante.correo}</p>
            </div>
            <div class="perfil-dato">
                <strong>Carrera:</strong>
                <p>${estudiante.carrera}</p>
            </div>
        `;

    } catch (error) {
        document.getElementById('perfil').innerHTML = `<p>Error al cargar el perfil: ${error.message}</p>`;
    }
});

function cerrarSesion() {
    window.location.href = "../index.html";
}
