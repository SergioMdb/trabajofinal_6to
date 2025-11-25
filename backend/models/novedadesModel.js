// SIEMPRE DEBE COINCIDIR CON EL NOMBRE EXACTO DEL ARCHIVO EN LA CARPETA SUPERIOR
// Si el archivo es 'DB.js', cámbialo a require('../DB')
// Si es 'database.js', cámbialo a require('../database')
const pool = require('../bd'); 

const util = require('util');

const query = util.promisify(pool.query).bind(pool);

// 1. OBTENER NOVEDADES
// Incluye 'imagen_url' para el frontend.
const getNovedades = async () => {
    try {
        const sql = "SELECT id, titulo, subtitulo, cuerpo, img_id, imagen_url FROM novedades ORDER BY id DESC";
        const rows = await query(sql);
        return rows;
    } catch (error) {
        throw error;
    }
};

// 2. INSERTAR NOVEDAD
// Incluye 'imagen_url' del objeto 'obj'.
const insertNovedad = async (obj) => {
    try {
        const sql = "INSERT INTO novedades SET ?"; 
        const rows = await query(sql, obj);
        return rows;
    } catch (error) {
        throw error;
    }
};

// 3. OBTENER NOVEDAD POR ID (para modificar o eliminar)
// Incluye 'imagen_url'.
const getNovedadById = async (id) => {
    try {
        const sql = "SELECT id, titulo, subtitulo, cuerpo, img_id, imagen_url FROM novedades WHERE id = ?";
        const rows = await query(sql, [id]);
        return rows.length > 0 ? rows[0] : null;
    } catch (error) {
        throw error;
    }
};

// 4. MODIFICAR NOVEDAD
// Incluye 'imagen_url' del objeto 'obj'.
const modificarNovedadById = async (obj, id) => {
    try {
        const sql = "UPDATE novedades SET ? WHERE id = ?";
        const rows = await query(sql, [obj, id]);
        return rows;
    } catch (error) {
        throw error;
    }
};

// 5. ELIMINAR NOVEDAD
const deleteNovedadById = async (id) => {
    try {
        const sql = "DELETE FROM novedades WHERE id = ?";
        const rows = await query(sql, [id]);
        return rows;
    } catch (error) {
        throw error;
    }
};


module.exports = {
    getNovedades,
    insertNovedad,
    getNovedadById,
    modificarNovedadById,
    deleteNovedadById,
};