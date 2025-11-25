const cloudinary = require('cloudinary').v2;
const fs = require('fs');

// Configura Cloudinary (Asegúrate de que estas variables de entorno están cargadas)
// Si no usas .env, estas credenciales deben estar definidas aquí o en app.js
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * Sube una imagen a Cloudinary.
 * @param {object} file - El objeto de archivo proporcionado por express-fileupload (req.files.imagen)
 * @returns {Promise<{public_id: string, secure_url: string}>} Objeto con el ID y la URL.
 */
const subirImagen = (file) => {
    return new Promise((resolve, reject) => {
        // CRÍTICO: El error "No se encontró el archivo..." ocurre aquí si file.tempFilePath es undefined.
        if (!file || !file.tempFilePath) {
            return reject(new Error('No se encontró el archivo o la ruta temporal.'));
        }

        cloudinary.uploader.upload(file.tempFilePath, { folder: 'HardwareWhite' }, (err, result) => {
            // Una vez subido a Cloudinary, eliminamos el archivo temporal.
            fs.unlink(file.tempFilePath, (unlinkErr) => {
                if (unlinkErr) console.warn('Advertencia: No se pudo eliminar el archivo temporal:', unlinkErr);
            });

            if (err) {
                console.error("Error al subir a Cloudinary:", err);
                return reject(err);
            }
            
            // CORRECCIÓN CLAVE: Devolvemos un objeto simplificado que incluye la URL.
            resolve({
                public_id: result.public_id,
                secure_url: result.secure_url // <--- La URL es necesaria para el frontend
            });
        });
    });
};

/**
 * Elimina una imagen de Cloudinary.
 * @param {string} publicId - El ID público de la imagen a eliminar.
 * @returns {Promise<object>} Objeto de respuesta de Cloudinary.
 */
const eliminarImagen = (publicId) => {
    return new Promise((resolve, reject) => {
        if (!publicId) {
            return resolve({ message: 'No public ID provided.' });
        }
        cloudinary.uploader.destroy(publicId, (err, result) => {
            if (err) {
                console.error("Error al eliminar en Cloudinary:", err);
                return reject(err);
            }
            resolve(result);
        });
    });
};

module.exports = {
    subirImagen,
    eliminarImagen
};