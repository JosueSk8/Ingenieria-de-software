document.getElementById("loginForm").addEventListener("submit", async (event) => {
    event.preventDefault();

    const correo = document.getElementById("correo").value.trim().toLowerCase();
    const contrasena = document.getElementById("contrasena").value.trim();

    const respuesta = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ correo, contrasena }),
    });

    if (respuesta.ok) {
        const data = await respuesta.json();

        if (data.tipo === "estudiante") {
            localStorage.setItem('estudianteId', data.id);
            window.location.href = `Estudiante/perfil.html?id=${data.id}`;
        } else if (data.tipo === "profesor") {

            window.location.href = `Profesor/perfil.html?id=${data.id}`;
        } else if (data.tipo === "evaluador") {

            window.location.href = `Evaluador/perfil.html?id=${data.id}`;
        } else if (data.tipo === "administrador") {

            window.location.href =`Admin/perfil.html?id=${data.id}`;
        }
    } else {
        document.getElementById("mensaje").innerText = "Correo o contraseña incorrectos";
    }
});
