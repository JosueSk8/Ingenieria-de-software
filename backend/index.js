const express = require('express');
const cors = require('cors');
const { conexionDB } = require('./conexion');  // Importar la función de conexión a la base de datos
const generarRutasCRUD = require('./crudGenerator'); // Importar el generador de rutas CRUD
const { ObjectId } = require('mongodb');
const app = express();
const puerto = 3000;

// Middleware para habilitar CORS y parsear JSON
app.use(cors());
app.use(express.json());

// Conectar a la base de datos y luego crear las rutas CRUD
conexionDB()
    .then(db => {
        // Crear las rutas CRUD para cada colección
        generarRutasCRUD(app, db, 'estudiantes');
        generarRutasCRUD(app, db, 'profesores');
        generarRutasCRUD(app,db,'evaluadores');
        generarRutasCRUD(app,db,'administradores');
        generarRutasCRUD(app,db,'equipos');

        // Ruta personalizada: Obtener equipo por ID de estudiante
        app.get('/equipos/estudiante/:idEstudiante', async (req, res) => {
            const idEstudiante = req.params.idEstudiante;
            if (!ObjectId.isValid(idEstudiante)) {
                return res.status(400).send('ID de estudiante inválido');
            }

            try {
                console.log('Buscando equipo con estudiante ID:', idEstudiante);

                const equipo = await db.collection('equipos').findOne({ estudiantes: idEstudiante });

                console.log('Equipo encontrado:', equipo);

                if (!equipo) {
                    return res.status(404).send('El estudiante no está asignado a ningún equipo');
                }
                const estudiantesIds = equipo.estudiantes.map(id => new ObjectId(id));
                // Obtener datos completos de los estudiantes del equipo
                const estudiantes = await db.collection('estudiantes')
                    .find({ _id: { $in: estudiantesIds } })
                    .project({ nombre: 1 })  // Solo traer el campo nombre (y _id implícito)
                    .toArray();
                equipo.estudiantes = estudiantes;
                res.json(equipo);

            } catch (err) {
                console.error(err);
                res.status(500).send('Error al obtener el equipo del estudiante');
            }
        });

        // Iniciar el servidor
        app.listen(puerto, () => {
            console.log(`Servidor corriendo en http://localhost:${puerto}`);
        });
    })
    .catch(err => {
        console.error("No se pudo conectar a MongoDB:", err);
    });

// Ruta principal
app.get('/', (req, res) => {
    res.send("¡Bienvenido a la API!");
});
