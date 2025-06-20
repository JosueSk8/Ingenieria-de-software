document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form-estudiante');  // Obtenemos el formulario

    form.addEventListener('submit', async (e) => {
        e.preventDefault();  // Prevenimos el comportamiento por defecto del formulario

        // Recogemos los valores de los campos del formulario
        const estudiante = {
            nombre: document.getElementById('nombre').value,
            correo: document.getElementById('email').value,
            contrasena: document.getElementById('password').value,
            boleta: document.getElementById('boleta').value,
            fechaNacimiento: document.getElementById('fecha').value,
            carrera: document.getElementById('carrera').value
        };

        try {
            // Enviamos los datos del estudiante al backend usando fetch
            const res = await fetch('http://localhost:3000/estudiantes/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(estudiante)  // Convertimos el objeto en una cadena JSON
            });

            // Verificamos la respuesta del servidor
            if (res.ok) {
                const data = await res.json();  // Esperamos la respuesta del servidor
                const estudianteId = data.id;  // Obtenemos el ID del nuevo estudiante

                alert('Estudiante registrado exitosamente.');
                localStorage.setItem('estudianteId', data.id);
                // Redirigimos a la página del perfil del estudiante
                window.location.href = `../../html/Estudiante/perfil.html?id=${estudianteId}`;

            } else {
                alert('Error al registrar el estudiante.');
            }
        } catch (error) {
            console.error('Error en la solicitud:', error);
            alert('No se pudo conectar con el servidor.');
        }
    });
});


