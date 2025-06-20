document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form'); // Obtenemos el formulario

    form.addEventListener('submit', async (e) => {
        e.preventDefault(); // Evitamos el envío tradicional

        // Obtenemos los valores del formulario
        const evaluador = {
            nombre: document.getElementById('nombre').value,
            area: document.getElementById('area').value,
            correo: document.getElementById('correo').value,
            contrasena: document.getElementById('contrasena').value
        };

        try {
            const res = await fetch('http://localhost:3000/evaluadores/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(evaluador)
            });

            if (res.ok) {
                const data = await res.json();
                const evaluadorId = data.id;

                alert('Evaluador registrado exitosamente.');

                // Redirigimos a la página de perfil del evaluador
                localStorage.setItem('evaluadorId', data.id);
                window.location.href = `../html/Evaluador/perfil.html?id=${evaluadorId}`;
            } else {
                const err = await res.json();
                alert(`Error: ${err.message || 'No se pudo registrar el evaluador.'}`);
            }

        } catch (error) {
            console.error('Error al registrar evaluador:', error);
            alert('No se pudo conectar con el servidor.');
        }
    });
});
