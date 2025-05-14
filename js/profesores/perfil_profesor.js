document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const profesorId = params.get('id');

    if (!profesorId) {
        document.getElementById('perfil').innerHTML = "<p>Error: ID de profesor no proporcionado.</p>";
        return;
    }

    try {
        const res = await fetch(`http://localhost:3000/profesores/${profesorId}`);

        if (!res.ok) {
            throw new Error("No se pudo cargar el perfil");
        }

        const profesor = await res.json();

        document.getElementById('perfil').innerHTML = `
            <p><strong>Nombre:</strong> ${profesor.nombre}</p>
            <p><strong>Correo:</strong> ${profesor.correo}</p>
            <p><strong>Departamento:</strong> ${profesor.departamento}</p>
        `;
    } catch (error) {
        document.getElementById('perfil').innerHTML = `<p>Error al cargar el perfil: ${error.message}</p>`;
    }
});

function cerrarSesion() {
    window.location.href = "../index.html";
}