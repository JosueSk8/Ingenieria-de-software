document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form'); // Obtenemos el formulario

    form.addEventListener('submit', async (e) => {
        e.preventDefault(); // Evitamos el envío tradicional

        // Obtenemos los valores del formulario
        const nombre = document.getElementById('nombre').value.trim();
        const departamento = document.getElementById('departamento').value.trim();
        const correo = document.getElementById('correo').value.trim();
        const contrasena = document.getElementById('contrasena').value.trim();

        const correoRegex = /^[a-zA-Z0-9._%+-]+@escom\.ipn\.mx$/;

        if (!correoRegex.test(correo)) {
            alert('El correo debe ser institucional (terminar en @escom.ipn.mx)');
            return;
        }

        const profesor = { nombre, departamento, correo, contrasena };

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
                const profesorId = data.id;

                alert('Profesor registrado exitosamente.');

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
