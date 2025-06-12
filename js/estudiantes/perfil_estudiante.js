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
            <p><strong>Nombre:</strong> ${estudiante.nombre}</p></td>
            <p><strong>Correo:</strong> ${estudiante.correo}</p>
            <p><strong>Carrera:</strong> ${estudiante.carrera}</p>
        `;
    } catch (error) {
        document.getElementById('perfil').innerHTML = `<p>Error al cargar el perfil: ${error.message}</p>`;
    }
});

function cerrarSesion() {
    window.location.href = "../index.html";
}
