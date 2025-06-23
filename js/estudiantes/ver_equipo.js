document.addEventListener('DOMContentLoaded', () => {
    const contenedorEquipo = document.getElementById('equipo');
    const estudianteId = localStorage.getItem('estudianteId');

    if (!estudianteId) {
        contenedorEquipo.innerHTML = '<p>No se encontró información del estudiante. Inicia sesión.</p>';
        return;
    }

    async function cargarEquipo() {
        try {
            const resEquipo = await fetch(`http://localhost:3000/equipos/estudiante/${estudianteId}`);
            if (!resEquipo.ok) throw new Error('No se pudo cargar el equipo.');

            const equipo = await resEquipo.json();

            const resEstudiantes = await fetch('http://localhost:3000/estudiantes');
            if (!resEstudiantes.ok) throw new Error('No se pudieron cargar los estudiantes.');

            const todosEstudiantes = await resEstudiantes.json();

            console.log('equipo.estudiantes:', equipo.estudiantes);
            console.log('todosEstudiantes IDs:', todosEstudiantes.map(e => e._id));

            const idsEquipo = equipo.estudiantes.map(e => e._id);
            console.log('IDs del equipo:', idsEquipo);

            const integrantes = todosEstudiantes.filter(est => {
                const estId = est._id;
                const incluido = idsEquipo.includes(estId);
                console.log(`Comparando est._id: ${estId}, incluido: ${incluido}`);
                return incluido;
            });

            contenedorEquipo.innerHTML = `
                <h2>Nombre del equipo: ${equipo.nombre}</h2>
                <h3>Integrantes:</h3>
                <ul>
                    ${integrantes.map(est => `<li>${est.nombre}</li>`).join('')}
                </ul>
            `;

        } catch (error) {
            console.error(error);
            contenedorEquipo.innerHTML = '<p>Error cargando el equipo.</p>';
        }
    }

    cargarEquipo();
});

function cerrarSesion() {
    localStorage.removeItem('estudianteId');
    window.location.href = "../index.html";
}
