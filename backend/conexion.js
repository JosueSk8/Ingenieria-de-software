// configurar la conexión para nuestra base de datos en MongoDB
const { MongoClient } = require('mongodb');

// especificar la URL de conexión y la base de datos
const client = new MongoClient("mongodb://localhost:27017");
const dbName = "mibase";

// función para conectarnos a la base
const conexionDB = () => {
    return client.connect()
        .then(dbClient => dbClient.db(dbName)) // ← aquí especificamos la base
        .catch(err => console.log(err));
};



// exportar para otro módulo
module.exports = { conexionDB };
