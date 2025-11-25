// Importamos la librería de Cloudinary
var cloudinary = require('cloudinary').v2; 
const fs = require('fs/promises'); // Para manejar la eliminación de archivos temporales

// ===============================================
// === CORRECCIÓN CRÍTICA: Configuración Global ===
// La configuración DEBE estar presente para que los métodos de uploader funcionen.
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true // Recomendado para usar HTTPS
});
// ===============================================


/**
 * Sube un archivo a Cloudinary.
 * @param {string} filePath La ruta temporal del archivo (req.file.path de Multer).
 * @param {string} folder La carpeta donde se almacenará en Cloudinary (ej: 'blog_images').
 * @returns {Promise<{public_id: string, secure_url: string}>} El ID público y la URL segura del recurso.
 */
const uploadImage = async (filePath, folder) => {
    let result = null;
    try {
        // El método uploader.upload sube el archivo desde la ruta temporal.
        // Dado que ya configuramos Cloudinary arriba, esta llamada debería funcionar.
        result = await cloudinary.uploader.upload(filePath, { folder: folder });
        
        // Devolvemos solo la información esencial que guardaremos en la DB
        return {
            public_id: result.public_id,
            secure_url: result.secure_url
        };
    } catch (error) {
        // Esto capturará errores de autenticación si las variables .env están mal.
        console.error('Error al subir imagen a Cloudinary (Verifique las credenciales .env):', error);
        throw new Error('Fallo al subir la imagen. (Revisar logs de Cloudinary)');
    } finally {
        // Importante: Eliminar el archivo temporal del servidor después de la subida
        if (filePath) {
            await fs.unlink(filePath).catch(err => console.error('Error al eliminar archivo temporal:', err));
        }
    }
};

/**
 * Elimina un archivo de Cloudinary.
 * @param {string} publicId El ID público del recurso a eliminar.
 * @returns {Promise<object>} El resultado de la operación de destrucción.
 */
const deleteImage = async (publicId) => {
    try {
        // El método uploader.destroy elimina el recurso por su ID público.
        const result = await cloudinary.uploader.destroy(publicId);
        return result;
    } catch (error) {
        console.error('Error al eliminar imagen de Cloudinary:', error);
        throw new Error('Fallo al eliminar la imagen.');
    }
};

module.exports = {
    uploadImage,
    deleteImage
};