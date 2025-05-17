document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const adminId = params.get('id');

    if (!adminId) {
        document.getElementById('perfil').innerHTML = "<p>Error: ID de administrador no proporcionado.</p>";
        return;
    }

    try {
        const res = await fetch(`http://localhost:3000/administradores/${adminId}`);

        if (!res.ok) {
            throw new Error("No se pudo cargar el perfil");
        }

        const admin = await res.json();

        document.getElementById('perfil').innerHTML = `
            <p><strong>Nombre:</strong> ${admin.nombre}</p>
            <p><strong>Correo:</strong> ${admin.correo}</p>
        `;
    } catch (error) {
        document.getElementById('perfil').innerHTML = `<p>Error al cargar el perfil: ${error.message}</p>`;
    }
});

function cerrarSesion() {
    window.location.href = "../index.html";
}
