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

        const fotoUrl = profesor.foto || "https://cdn-icons-png.flaticon.com/512/149/149071.png";

        perfil.innerHTML = `
            <div class="card-foto">
                <img src="${fotoUrl}" alt="Foto del estudiante">
                <p>${profesor.nombre}</p>
            </div>
            <div class="card-perfil"><i class="fas fa-user"></i><span><strong>Nombre:</strong> ${profesor.nombre}</span></div>
            <div class="card-perfil"><i class="fas fa-envelope"></i><span><strong>Correo:</strong> ${profesor.correo}</span></div>
        `;
    } catch (error) {
        document.getElementById('perfil').innerHTML = `<p>Error al cargar el perfil: ${error.message}</p>`;
    }
});

function cerrarSesion() {
    window.location.href = "../index.html";
}