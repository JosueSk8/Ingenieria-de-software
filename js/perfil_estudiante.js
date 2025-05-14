document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const estudianteId = params.get("id");

    if (!estudianteId) {
        document.getElementById("perfil").innerText = "ID de estudiante no proporcionado.";
        return;
    }

        fetch(`http://localhost:3000/estudiantes/${estudianteId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("No se pudo obtener la información del estudiante.");
            }
            return response.json();
        })
        .then(estudiante => {
            const perfilDiv = document.getElementById("perfil");
            perfilDiv.innerHTML = `
                <p><strong>Nombre:</strong> ${estudiante.nombre}</p>
                <p><strong>Email:</strong> ${estudiante.correo || 'No especificado'}</p>
                <p><strong>Carrera:</strong> ${estudiante.carrera || 'No especificado'}</p>
            `;
        })
        .catch(error => {
            console.error("Error al cargar el perfil:", error);
            document.getElementById("perfil").innerText = "Error al cargar el perfil.";
        });
});
