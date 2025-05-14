document.getElementById("loginForm").addEventListener("submit", async (event) => {
    event.preventDefault();

    const correo = document.getElementById("correo").value;
    const contrasena = document.getElementById("contrasena").value;

    const respuesta = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ correo, contrasena }),
    });

    if (respuesta.ok) {
        const data = await respuesta.json();

        // Redirigir dependiendo del tipo
        if (data.tipo === "estudiante") {
            window.location.href = `Estudiante/perfil.html?id=${data.id}`;
        } else if (data.tipo === "profesor") {
            window.location.href = `Profesor/perfil.html?id=${data.id}`;
        }

    } else {
        document.getElementById("mensaje").innerText = "Correo o contraseña incorrectos";
    }
});
