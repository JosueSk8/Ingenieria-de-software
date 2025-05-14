document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form'); // Obtenemos el formulario

    form.addEventListener('submit', async (e) => {
        e.preventDefault(); // Evitamos el envío tradicional

        // Obtenemos los valores del formulario
        const profesor = {
            nombre: document.getElementById('nombre').value,
            departamento: document.getElementById('departamento').value,
            correo: document.getElementById('correo').value,
            contrasena: document.getElementById('contrasena').value
        };

        try {
            const res = await fetch('http://localhost:3000/profesores/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(profesor)
            });

            if (res.ok) {
                const data = await res.json();
                const profesorId = data.id; // Suponemos que la API devuelve el id del profesor

                alert('Profesor registrado exitosamente.');

                // Redirigimos a la página de perfil del profesor
                window.location.href = `../html/Profesor/perfil.html?id=${profesorId}`;
            } else {
                const err = await res.json();
                alert(`Error: ${err.message || 'No se pudo registrar el profesor.'}`);
            }

        } catch (error) {
            console.error('Error al registrar:', error);
            alert('No se pudo conectar con el servidor.');
        }
    });
});
