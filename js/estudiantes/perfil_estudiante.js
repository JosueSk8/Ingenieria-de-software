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

        const fotoUrl = estudiante.foto || "https://cdn-icons-png.flaticon.com/512/149/149071.png";

        perfil.innerHTML = `
            <div class="card-foto">
                <img src="${fotoUrl}" alt="Foto del estudiante">
                <p>${estudiante.nombre}</p>
            </div>
            <div class="card-perfil"><i class="fas fa-user"></i><span><strong>Nombre:</strong> ${estudiante.nombre}</span></div>
            <div class="card-perfil"><i class="fas fa-envelope"></i><span><strong>Correo:</strong> ${estudiante.correo}</span></div>
            <div class="card-perfil"><i class="fas fa-graduation-cap"></i><span><strong>Carrera:</strong> ${estudiante.carrera}</span></div>
        `;

    } catch (error) {
        document.getElementById('perfil').innerHTML = `<p>Error al cargar el perfil: ${error.message}</p>`;
    }
});

function cerrarSesion() {
    window.location.href = "../index.html";
}
