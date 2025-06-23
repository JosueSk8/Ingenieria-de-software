document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form-estudiante');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const nombre = document.getElementById('nombre').value.trim();
        const correo = document.getElementById('email').value.trim().toLowerCase();
        const contrasena = document.getElementById('password').value;
        const boleta = document.getElementById('boleta').value.trim();
        const fechaNacimiento = document.getElementById('fecha').value;
        const carrera = document.getElementById('carrera').value;

        // Validaciones básicas
        if (!nombre || !correo || !contrasena || !boleta || !fechaNacimiento || !carrera) {
            alert('Por favor completa todos los campos.');
            return;
        }

        if (!/^\d{10}$/.test(boleta)) {
            alert('La boleta debe contener exactamente 10 dígitos.');
            return;
        }

        const fechaHoy = new Date();
        const fechaNac = new Date(fechaNacimiento);
        if (fechaNac >= fechaHoy) {
            alert('La fecha de nacimiento debe ser anterior a hoy.');
            return;
        }

        try {
            const verificarRes = await fetch(`http://localhost:3000/estudiantes/verificar?correo=${encodeURIComponent(correo)}&boleta=${encodeURIComponent(boleta)}`);

            if (!verificarRes.ok) throw new Error('Error en verificación');

            const verificarData = await verificarRes.json();

            if (verificarData.correoRegistrado) {
                alert('El correo ya está registrado.');
                return;
            }

            if (verificarData.boletaRegistrada) {
                alert('La boleta ya está registrada.');
                return;
            }

            // Si pasa todas las validaciones
            const estudiante = {
                nombre,
                correo,
                contrasena,
                boleta,
                fechaNacimiento,
                carrera
            };

            const res = await fetch('http://localhost:3000/estudiantes/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(estudiante)
            });

            if (res.ok) {
                const data = await res.json();
                alert('Estudiante registrado exitosamente.');
                localStorage.setItem('estudianteId', data.id);
                window.location.href = `../../../html/Estudiante/perfil.html?id=${data.id}`;
            } else {
                alert('Error al registrar el estudiante.');
            }
        } catch (error) {
            console.error('Error al verificar duplicados:', error);
            alert('Hubo un error al verificar duplicados.');
        }
    });
});
