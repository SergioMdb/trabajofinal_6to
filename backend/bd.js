var mysql = require('mysql');
var util = require('util');

// Crea el pool de conexiones usando las variables de entorno
// (que deben estar cargadas previamente con 'dotenv')
var pool = mysql.createPool({
    connectionLimit: 10, // Define el número máximo de conexiones que puede tener el pool
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB_NAME
});

// Convierte el método 'query' del pool en un método que devuelve promesas asíncronas.
// Esto permite usar 'await' en las funciones que ejecutan consultas.
pool.query = util.promisify(pool.query);

// Exporta el pool de conexiones ya configurado.
module.exports = pool;