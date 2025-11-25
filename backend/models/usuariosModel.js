var pool = require('../bd'); // <--- RUTA CORREGIDA: Asumimos que 'bd.js' está un nivel arriba
var md5 = require('md5');

/* * Función para buscar un usuario por su nombre de usuario.
 * (La usaremos en el login)
 */
async function getUserByUsername(user) {
    try {
        // Query para buscar el usuario por el campo 'usuario'
        var query = "SELECT * FROM usuarios WHERE usuario = ? LIMIT 1";
        var rows = await pool.query(query, [user]);
        
        // Devolvemos la primera (y única) fila encontrada, o null si no existe
        return rows.length === 1 ? rows[0] : null;

    } catch (error) {
        console.log("Error en getUserByUsername:", error);
        throw error;
    }
}


/* * Función para buscar un usuario por nombre y contraseña.
 * (Esta es la función legacy, pero es bueno tenerla por si la necesitas)
 */
async function getUserByUsernameAndPassword(user, password) {
    try {
        var query = "SELECT * FROM usuarios WHERE usuario = ? AND password = ? LIMIT 1";
        var rows = await pool.query(query, [user, md5(password)]);
        return rows[0];
    } catch (error) {
        console.log(error);
    }
}


// Exportar las funciones que el router necesita
module.exports = {
    getUserByUsername,
    getUserByUsernameAndPassword
}