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

    // ✅ Ruta para obtener un documento por ID (necesaria para ver el perfil)
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
        const { correo, contrasena } = req.body;

        try {
            // Buscar en estudiantes
            const estudiante = await db.collection('estudiantes').findOne({ correo, contrasena });
            if (estudiante) {
                return res.json({ id: estudiante._id, tipo: 'estudiante' });
            }

            // Buscar en profesores
            const profesor = await db.collection('profesores').findOne({ correo, contrasena });
            if (profesor) {
                return res.json({ id: profesor._id, tipo: 'profesor' });
            }

            // Si no se encuentra en ninguna colección
            res.status(401).json({ mensaje: 'Correo o contraseña incorrectos' });
        } catch (error) {
            console.error("Error en login:", error);
            res.status(500).send("Error en el servidor");
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
}

module.exports = generarRutasCRUD;
