// Importamos Multer, la librería estándar para manejar "multipart/form-data" (subida de archivos)
var multer = require('multer');
const path = require('path');

// =========================================================================
// CONFIGURACIÓN DE MULTER
// =========================================================================

// Configuración de almacenamiento: Usaremos el almacenamiento en disco (diskStorage) 
// para guardar archivos temporalmente.
var storage = multer.diskStorage({
    // La carpeta 'tmp' debe existir en la raíz de tu proyecto para almacenar los archivos antes de subirlos a Cloudinary.
    destination: function (req, file, cb) {
        // Establece el destino de los archivos temporales.
        // Se asume que existe una carpeta 'tmp' en la raíz de la aplicación (backend).
        cb(null, 'tmp/') 
    },
    // Opciones para nombrar el archivo temporalmente
    filename: function (req, file, cb) {
        // Genera un nombre de archivo único con la fecha y la extensión original.
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// Configuración principal de Multer:
// 1. Usamos la configuración de almacenamiento definida arriba.
// 2. Definimos límites (opcional). Aquí, limitamos el tamaño a 5MB.
// 3. Definimos un filtro para solo aceptar imágenes (opcional pero recomendado).
var upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (req, file, cb) => {
        // Aceptar solo archivos JPEG, PNG y GIF
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            // Rechazar otros tipos de archivo
            cb(new Error('Solo se permiten archivos de imagen (jpg, jpeg, png, gif).'), false);
        }
    }
});

// Exportamos la instancia de Multer configurada
module.exports = upload;