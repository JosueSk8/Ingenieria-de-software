document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form'); // Obtenemos el formulario

    form.addEventListener('submit', async (e) => {
        e.preventDefault(); // Evitamos el envío tradicional

        // Obtenemos los valores del formulario
        const admin = {
            nombre: document.getElementById('nombre').value.trim(),
            correo: document.getElementById('correo').value.trim().toLowerCase(),
            contrasena: document.getElementById('contrasena').value.trim()
        };

        try {
            const res = await fetch('http://localhost:3000/administradores/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(admin)
            });

            if (res.ok) {
                const data = await res.json();
                const adminId = data.id; // Suponemos que la API devuelve el id del administrador

                alert('Administrador registrado exitosamente.');

                // Redirigimos a la página de perfil del administrador
                window.location.href = `../html/Admin/perfil.html?id=${adminId}`;
            } else {
                const err = await res.json();
                alert(`Error: ${err.message || 'No se pudo registrar el administrador.'}`);
            }

        } catch (error) {
            console.error('Error al registrar:', error);
            alert('No se pudo conectar con el servidor.');
        }
    });
});
