// Controlador para manejar la lógica de las novedades
const { uploadImage } = require('../utils/cloudinary'); // <-- IMPORTANTE: Importamos la función de subida
// Nota: Ya no necesitamos importar 'fs/promises' aquí, ya que la limpieza del archivo temporal 
// la maneja la función 'uploadImage' en su bloque 'finally'.

// Asumo que tienes un modelo llamado Novedad (si no lo tienes, deberás descomentar y ajustar)
// const Novedad = require('../models/NovedadModel'); 


/**
 * Agrega una nueva novedad, sube la imagen a Cloudinary y guarda los datos en la DB.
 */
const agregarNovedad = async (req, res, next) => {
    // 1. Extraemos la información del archivo de Multer
    const file = req.file;
    const { titulo, cuerpo, subtitulo } = req.body;
    
    // Variables para almacenar la información de Cloudinary
    let imagenUrl = null;
    let publicId = null;

    try {
        // ------------------------------------------------------------------
        // PASO 1: Subida del archivo a Cloudinary
        // ------------------------------------------------------------------

        if (!file) {
            // Si la imagen es obligatoria, devuelve error. Si no lo es, continúa.
            return res.status(400).json({ error: 'La imagen de la novedad es requerida.' });
        }

        console.log(`Archivo recibido: ${file.filename} en ${file.path}`);
        console.log('Datos del formulario (body):', req.body);

        // Llamada REAL a la función de Cloudinary. El archivo temporal se borra internamente.
        const uploadResult = await uploadImage(file.path, 'novedades'); // 'novedades' es el folder

        imagenUrl = uploadResult.secure_url;
        publicId = uploadResult.public_id;
        
        // ------------------------------------------------------------------
        // PASO 2: Guardar en la Base de Datos
        // ------------------------------------------------------------------

        // Aquí iría la lógica para guardar en la DB. 
        // Ejemplo (Asumiendo Mongoose o similar):
        /*
        const nuevaNovedad = new Novedad({
            titulo,
            subtitulo,
            cuerpo,
            imagen_url: imagenUrl,
            imagen_public_id: publicId
        });
        await nuevaNovedad.save();
        */

        // Respuesta de éxito
        res.status(201).json({ 
            message: 'Novedad agregada exitosamente (Cloudinary OK).', 
            data: { titulo, imagen: imagenUrl, public_id: publicId } 
        });

    } catch (error) {
        // Si hay un error, se imprime en consola y se devuelve el 500
        console.error('Error al agregar novedad (POSIBLE FALLO DE CLOUDINARY O DB):', error.message);
        
        // IMPORTANTE: No se hace cleanup manual aquí porque Cloudinary lo hace internamente.
        
        res.status(500).json({ 
            error: 'Error interno del servidor al procesar la novedad.',
            details: error.message // Devolver el error.message ayuda a diagnosticar (ej. credenciales)
        });
    }
};

module.exports = {
    agregarNovedad
};