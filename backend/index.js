const express = require('express');
const cors = require('cors');
const multer = require('multer');
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
