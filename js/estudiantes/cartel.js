function descargarCartel() {
    const url = `http://localhost:3000/cartel`;
    const link = document.createElement('a');
    link.href = url;
    link.download = 'cartel.docx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

document.addEventListener('DOMContentLoaded', async () => {
    const estudianteId = localStorage.getItem('estudianteId');
    const cartelContainer = document.getElementById('cartel');

    if (!estudianteId) {
        cartelContainer.innerHTML = '<p>No se encontró información del estudiante.</p>';
        return;
    }

    try {
        const resEquipo = await fetch(`http://localhost:3000/equipos/estudiante/${estudianteId}`);
        if (!resEquipo.ok) throw new Error('No se pudo cargar el equipo');
        const equipo = await resEquipo.json();
        const equipoId = equipo._id;

        cartelContainer.innerHTML = `
            
            <input type="file" id="cartelInput" class="file-input">

            <div class="button-container">
                <button class="custom-button download-button" onclick="descargarCartel()">
                    <i class="fas fa-download"></i> Descargar plantilla
                </button>

                <div class="upload-group">
                    <button class="custom-button select-button" id="seleccionarArchivoBtn">
                        <i class="fas fa-upload"></i> Seleccionar archivo
                    </button>

                    <button class="custom-button upload-button d-none" id="subirCartelBtn">
                        <i class="fas fa-check"></i> Subir Cartel
                    </button>
                </div>
            </div>
        `;

        // Eventos después de crear elementos dinámicos
        const seleccionarBtn = document.getElementById('seleccionarArchivoBtn');
        const inputArchivo = document.getElementById('cartelInput');
        const subirBtn = document.getElementById('subirCartelBtn');

        seleccionarBtn.addEventListener('click', () => {
            inputArchivo.click();  // Simula click al input oculto
        });

        inputArchivo.addEventListener('change', () => {
            if (inputArchivo.files.length > 0) {
                subirBtn.classList.remove('d-none');
            }
        });

        subirBtn.addEventListener('click', () => subirCartel(equipoId));
    } catch (err) {
        console.error(err);
        cartelContainer.innerHTML = '<p>Error cargando el equipo.</p>';
    }
});

function subirCartel(equipoId) {
    const input = document.getElementById('cartelInput');
    const archivo = input.files[0];
    if (!archivo) return alert('Selecciona un archivo');

    const formData = new FormData();
    formData.append('cartel', archivo);

    fetch(`http://localhost:3000/cartel/subir/${equipoId}`, {
        method: 'POST',
        body: formData
    })
        .then(res => {
            if (res.ok) return res.text();
            else if (res.status === 409) throw new Error('Ya existe un cartel para este equipo');
            else throw new Error('Error al subir el cartel');
        })
        .then(msg => alert(msg))
        .catch(err => alert(err.message));
}

function cerrarSesion() {
    window.location.href = "../index.html";
}