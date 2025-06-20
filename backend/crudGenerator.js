const { ObjectId } = require('mongodb');

function generarRutasCRUD(app, db, nombreColeccion) {
    // Ruta para obtener todos los documentos de la colección
    app.get(`/${nombreColeccion}`, (req, res) => {
        db.collection(nombreColeccion).find().toArray()
            .then(datos => res.json(datos))
            .catch(err => {
                console.error(err);
                res.status(500).send(`Error al obtener ${nombreColeccion}`);
            });
    });

    //  Ruta para obtener un documento por ID (necesaria para ver el perfil)
    app.get(`/${nombreColeccion}/:id`, async (req, res) => {
        const id = req.params.id;

        if (!ObjectId.isValid(id)) {
            return res.status(400).send('ID inválido');
        }

        try {
            const documento = await db.collection(nombreColeccion).findOne({ _id: new ObjectId(id) });

            if (!documento) {
                return res.status(404).send(`${nombreColeccion} no encontrado`);
            }

            res.json(documento);
        } catch (err) {
            console.error(err);
            res.status(500).send(`Error al obtener ${nombreColeccion}`);
        }
    });

    app.post('/login', async (req, res) => {
        const correo = req.body.correo?.trim().toLowerCase();
        const contrasena = req.body.contrasena?.trim();

        try {
            const colecciones = [
                { nombre: 'estudiantes', tipo: 'estudiante' },
                { nombre: 'profesores', tipo: 'profesor' },
                { nombre: 'evaluadores', tipo: 'evaluador' },
                { nombre: 'administradores', tipo: 'administrador' }
            ];

            for (const coleccion of colecciones) {
                const usuario = await db.collection(coleccion.nombre).findOne({ correo, contrasena });
                if (usuario) {
                    return res.json({ id: usuario._id, tipo: coleccion.tipo });
                }
            }

            res.status(401).json({ mensaje: 'Correo o contraseña incorrectos' });
        } catch (error) {
            console.error("Error en login:", error);
            res.status(500).send("Error en el servidor");
        }
    });
    // ruta para crear los stands
    app.post('/stands/create', async (req, res) => {
        const { edificio, mesa } = req.body;

        try {
            const existente = await db.collection('stands').findOne({ edificio, mesa });
            if (existente) return res.status(409).send('Ya existe');

            await db.collection('stands').insertOne({ edificio, mesa });
            res.status(201).send('Stand creado');
        } catch (err) {
            console.error(err);
            res.status(500).send('Error en servidor');
        }
    });
    app.post('/eventos/create', async (req, res) => {
        const { nombre, fechaInicio, fechaFin, horaInicio } = req.body;

        if (!nombre || !fechaInicio || !fechaFin || !horaInicio) {
            return res.status(400).send("Datos incompletos");
        }

        try {
            await db.collection('eventos').insertOne({
                nombre,
                fechaInicio,
                fechaFin,
                horaInicio,
                creado: new Date()
            });

            res.status(201).send("Evento creado");
        } catch (err) {
            console.error(err);
            res.status(500).send("Error al registrar el evento");
        }
    });
    app.put('/eventos/:id', async (req, res) => {
        const id = req.params.id;
        const { nombre, fechaInicio, fechaFin, horaInicio } = req.body;

        try {
            const result = await db.collection('eventos').updateOne(
                { _id: new ObjectId(id) },
                {
                    $set: {
                        nombre,
                        fechaInicio,
                        fechaFin,
                        horaInicio
                    }
                }
            );

            if (result.matchedCount === 0) {
                return res.status(404).send("Evento no encontrado");
            }

            res.send("Evento actualizado");
        } catch (err) {
            console.error(err);
            res.status(500).send("Error al actualizar evento");
        }
    });





    // Ruta para crear un nuevo documento en la colección
    app.post(`/${nombreColeccion}/create`, (req, res) => {
        const nuevoDocumento = req.body;

        db.collection(nombreColeccion).insertOne(nuevoDocumento)
            .then(result => {
                res.status(201).json({
                    message: `Nuevo ${nombreColeccion} creado`,
                    id: result.insertedId
                });
            })
            .catch(err => {
                console.error(err);
                res.status(500).send(`Error al crear ${nombreColeccion}`);
            });
    });

    // Ruta para actualizar un documento en la colección por ID
    app.put(`/${nombreColeccion}/:id`, (req, res) => {
        const id = req.params.id;
        const nuevosDatos = req.body;

        if (!ObjectId.isValid(id)) {
            return res.status(400).send('ID inválido');
        }

        db.collection(nombreColeccion).updateOne(
            { _id: new ObjectId(id) },
            { $set: nuevosDatos }
        )
            .then(resultado => {
                if (resultado.matchedCount === 0) {
                    return res.status(404).send(`${nombreColeccion} no encontrado`);
                }
                res.send(`${nombreColeccion} actualizado con éxito`);
            })
            .catch(err => {
                console.error(err);
                res.status(500).send(`Error al actualizar ${nombreColeccion}`);
            });
    });

    // Ruta para eliminar un documento de la colección por ID
    app.delete(`/${nombreColeccion}/:id`, (req, res) => {
        const id = req.params.id;

        if (!ObjectId.isValid(id)) {
            return res.status(400).send('ID inválido');
        }

        db.collection(nombreColeccion).deleteOne({ _id: new ObjectId(id) })
            .then(resultado => {
                if (resultado.deletedCount === 0) {
                    return res.status(404).send(`${nombreColeccion} no encontrado`);
                }
                res.send(`${nombreColeccion} eliminado con éxito`);
            })
            .catch(err => {
                console.error(err);
                res.status(500).send(`Error al eliminar ${nombreColeccion}`);
            });
    });
    // Ruta personalizada para obtener equipo por ID de estudiante (solo para colección 'equipos')
    if (nombreColeccion === 'equipos') {
        app.get('/equipos/estudiante/:idEstudiante', async (req, res) => {
            const idEstudiante = req.params.idEstudiante;
            if (!ObjectId.isValid(idEstudiante)) {
                return res.status(400).send('ID de estudiante inválido');
            }

            try {
                console.log('Buscando equipo con estudiante ID:', idEstudiante);

                // Buscar equipo que tenga ese estudiante
                const equipo = await db.collection('equipos').findOne({
                    estudiantes: { $elemMatch: { $eq: idEstudiante } }
                });

                if (!equipo) {
                    return res.status(404).send('El estudiante no está asignado a ningún equipo');
                }

                // Obtener datos completos de los estudiantes del equipo
                const estudiantesIds = equipo.estudiantes.map(id => new ObjectId(id));
                const estudiantes = await db.collection('estudiantes')
                    .find({ _id: { $in: estudiantesIds } })
                    .project({ nombre: 1 })
                    .toArray();

                equipo.estudiantes = estudiantes;

                res.json(equipo);
            } catch (err) {
                console.error(err);
                res.status(500).send('Error al obtener el equipo del estudiante');
            }
        });

        // Ruta para registrar un proyecto a un equipo
        app.post('/equipos/:equipoId/proyecto', async (req, res) => {
            const equipoId = req.params.equipoId;
            const { nombre, descripcion, repositorio } = req.body;

            if (!ObjectId.isValid(equipoId)) {
                return res.status(400).send('ID de equipo inválido');
            }

            try {
                const equipo = await db.collection('equipos').findOne({ _id: new ObjectId(equipoId) });

                if (!equipo) {
                    return res.status(404).send('Equipo no encontrado');
                }

                if (equipo.proyecto) {
                    return res.status(409).send('Ya existe un proyecto registrado para este equipo');
                }

                await db.collection('equipos').updateOne(
                    { _id: new ObjectId(equipoId) },
                    { $set: { proyecto: { nombre, descripcion, repositorio } } }
                );

                res.send('Proyecto registrado exitosamente');
            } catch (err) {
                console.error(err);
                res.status(500).send('Error al registrar el proyecto');
            }
        });
        // Ruta para actualizar proyecto de un equipo
        app.put('/equipos/:equipoId/proyecto', async (req, res) => {
            const equipoId = req.params.equipoId;
            const { nombre, descripcion, repositorio } = req.body;

            if (!ObjectId.isValid(equipoId)) {
                return res.status(400).send('ID de equipo inválido');
            }

            try {
                const equipo = await db.collection('equipos').findOne({ _id: new ObjectId(equipoId) });

                if (!equipo) {
                    return res.status(404).send('Equipo no encontrado');
                }

                await db.collection('equipos').updateOne(
                    { _id: new ObjectId(equipoId) },
                    { $set: { proyecto: { nombre, descripcion, repositorio } } }
                );

                res.send('Proyecto actualizado exitosamente');
            } catch (err) {
                console.error(err);
                res.status(500).send('Error al actualizar el proyecto');
            }
        });


    }

    const path = require('path');
    const fs = require('fs');
    const multer = require('multer');

    if (nombreColeccion === 'estudiantes') {

        app.get('/cartel', (req, res) => {
            // Ajusta la ruta a tu estructura real del proyecto:
            const filePath = path.join(__dirname, '..', 'assets', 'cartel.docx');

            if (fs.existsSync(filePath)) {
                res.download(filePath, 'cartel.docx');
            } else {
                res.status(404).send('Cartel no encontrado');
            }
        });

        const uploadDir = path.join(__dirname, '..', 'assets', 'cartelesA');

        // Asegúrate que esta carpeta ya exista manualmente

        const storage = multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, uploadDir);
            },
            filename: function (req, file, cb) {
                const equipoId = req.params.equipoId;
                cb(null, `${equipoId}.docx`);
            }
        });

        const upload = multer({storage});

        // Ruta POST que verifica antes de guardar
        app.post('/cartel/subir/:equipoId', async (req, res) => {
            const equipoId = req.params.equipoId;
            if (!equipoId || equipoId === 'undefined') {
                return res.status(400).send('ID de equipo inválido');
            }

            const filePath = path.join(uploadDir, `${equipoId}.docx`);

            // Validación antes de usar multer
            if (fs.existsSync(filePath)) {
                return res.status(409).send('Ya existe un cartel para este equipo');
            }

            // Ejecuta multer una vez que pasamos la validación
            upload.single('cartel')(req, res, (err) => {
                if (err) {
                    console.error('Error al subir el archivo:', err);
                    return res.status(500).send('Error al subir el cartel');
                }

                if (!req.file) {
                    return res.status(400).send('No se recibió ningún archivo');
                }

                res.send('Cartel subido con éxito');
            });
        });
    }
}

module.exports = generarRutasCRUD;
