const { ObjectId } = require('mongodb');

function generarRutasCRUD(app, db, nombreColeccion) {
    // Ruta para obtener todos los documentos de la colección
    app.get(`/${nombreColeccion}`, (req, res) => {
        db.collection(nombreColeccion).find().toArray()
            .then(datos => res.send(datos))
            .catch(err => {
                console.error(err);
                res.status(500).send(`Error al obtener ${nombreColeccion}`);
            });
    });

    // Ruta para crear un nuevo documento en la colección
    app.post(`/${nombreColeccion}/create`, (req, res) => {
        db.collection(nombreColeccion).insertOne(req.body)
            .then(() => res.send(`Nuevo ${nombreColeccion} creado`))
            .catch(err => {
                console.error(err);
                res.status(500).send(`Error al crear ${nombreColeccion}`);
            });
    });

    // Ruta para actualizar un documento en la colección por ID
    app.put(`/${nombreColeccion}/:id`, (req, res) => {
        const id = req.params.id;
        const nuevosDatos = req.body;

        db.collection(nombreColeccion).updateOne(
            { _id: new ObjectId(id) },
            { $set: nuevosDatos }
        )
            .then(resultado => {
                if (resultado.matchedCount === 0) {
                    res.status(404).send(`${nombreColeccion} no encontrado`);
                } else {
                    res.send(`${nombreColeccion} actualizado`);
                }
            })
            .catch(err => {
                console.error(err);
                res.status(500).send(`Error al actualizar ${nombreColeccion}`);
            });
    });

    // Ruta para eliminar un documento de la colección por ID
    app.delete(`/${nombreColeccion}/:id`, (req, res) => {
        const id = req.params.id;

        db.collection(nombreColeccion).deleteOne({ _id: new ObjectId(id) })
            .then(resultado => {
                if (resultado.deletedCount === 0) {
                    res.status(404).send(`${nombreColeccion} no encontrado`);
                } else {
                    res.send(`${nombreColeccion} eliminado`);
                }
            })
            .catch(err => {
                console.error(err);
                res.status(500).send(`Error al eliminar ${nombreColeccion}`);
            });
    });
}

module.exports = generarRutasCRUD;
