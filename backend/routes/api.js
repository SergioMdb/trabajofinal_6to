var express = require('express');
var router = express.Router();
var novedadesModel = require('../models/novedadesModel'); // Modelo de novedades
var cloudinary = require('cloudinary').v2; // Usamos Cloudinary para generar la URL
var jwt = require('jsonwebtoken'); // 🔑 NECESARIO para generar el token JWT
var bcrypt = require('bcryptjs'); // 🔑 NECESARIO para comparar contraseñas hasheadas
var usuariosModel = require('../models/usuariosModel'); // 🔑 NECESARIO para buscar usuarios en la DB

// -----------------------------------------------------------------------
// CORRECCIÓN: Usamos 'cloudinaryUtils' ya que exporta 'uploadImage' y 'deleteImage'
var cloudinaryUtils = require('../utils/cloudinary'); 
// -----------------------------------------------------------------------

var upload = require('../middleware/uploadMiddleware'); // 🔑 NECESARIO para gestionar la subida de archivos (multiform)


// ===========================================
// 0. MIDDLEWARE para verificar el Token JWT
// Aplica a todas las rutas que estén DESPUÉS de él.
// ===========================================
function verifyToken(req, res, next) {
    try {
        // 1. Obtener el token del header Authorization
        let token = req.headers['authorization'];
        
        // El token viene como "Bearer <token>", lo separamos
        if (token && token.startsWith('Bearer ')) {
            token = token.slice(7, token.length);
        } else {
            // Si no hay token o no tiene el formato correcto
            return res.status(401).json({ error: 'No token provided.' });
        }

        // 2. Verificar y decodificar el token
        jwt.verify(token, process.env.JWT_KEY || 'mi_clave_secreta_para_jwt', (err, decoded) => {
            if (err) {
                // Token no válido o expirado
                return res.status(401).json({ error: 'Token is not valid or expired.' });
            }
            // 3. Si es válido, guardar el payload en req.user y pasar al siguiente middleware/ruta
            req.user = decoded; 
            next();
        });
    } catch (error) {
        console.error("Error en verifyToken:", error);
        res.status(500).json({ error: 'Internal server error.' });
    }
}


// ===========================================
// 1. ENDPOINT PÚBLICO para listar novedades
// GET /api/novedades
// ===========================================
router.get('/novedades', async function(req, res, next) {
    try {
        let novedades = await novedadesModel.getNovedades();
        
        // Transformar el array para agregar la URL completa de la imagen
        novedades = novedades.map(novedad => {
            // Si existe img_id (el ID de Cloudinary), generamos la URL
            if (novedad.img_id) { 
                // Genera la URL de la imagen de Cloudinary usando el public_id (img_id)
                const imagen_url_transformed = cloudinary.url(novedad.img_id, {
                    width: 460, 
                    crop: 'fill' // Opciones de transformación
                });
                return {
                    ...novedad,
                    // Agrega la propiedad 'imagen' con la URL transformada para el frontend
                    imagen: imagen_url_transformed
                }
            } else {
                // Si no hay img_id, usa la URL del campo 'imagen_url' que viene de la DB (o vacío).
                return {
                    ...novedad,
                    imagen: novedad.imagen_url || '' 
                }
            }
        });

        res.json(novedades); // Envía el array como respuesta JSON
    } catch (error) {
        console.error("Error al obtener novedades:", error);
        res.status(500).json({ error: 'Error interno del servidor al obtener novedades.' });
    }
});


// ===========================================
// 2. ENDPOINT PÚBLICO para login (Generación de Token JWT)
// POST /api/login
// ===========================================
router.post('/login', async (req, res, next) => {
    try {
        const { usuario, password } = req.body;
        
        const user = await usuariosModel.getUserByUsername(usuario);

        console.log("--- INTENTO DE LOGIN ---");
        console.log("Usuario recibido:", usuario);
        
        if (user != null) {
            const passwordMatch = await bcrypt.compare(password, user.password);

            if (passwordMatch) {
                const token = jwt.sign({
                    id: user.id,
                    username: user.usuario
                },
                process.env.JWT_KEY || 'mi_clave_secreta_para_jwt', 
                { 
                    expiresIn: '1h' 
                });

                res.json({
                    success: true,
                    message: '¡Login exitoso!',
                    token: token
                });

            } else {
                res.status(401).json({ error: 'Usuario o contraseña incorrectos.' });
            }
        } else {
            res.status(401).json({ error: 'Usuario o contraseña incorrectos.' });
        }

    } catch (error) {
        console.error("Error en el login de la API:", error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});


// ===========================================
// 3. ENDPOINT PROTEGIDO para crear una novedad
// POST /api/novedades/agregar 
// REQUIERE: Token, Contenido, y Opcionalmente una imagen (multipart/form-data)
// ===========================================
router.post('/novedades/agregar', verifyToken, upload.single('imagen'), async (req, res, next) => {
    try {
        const { titulo, subtitulo, cuerpo } = req.body;
        let imagen_url = '';
        let img_id = ''; // <-- Usamos img_id
        const folderName = "hardwarewhite_novedades"; // Carpeta de destino en Cloudinary

        // === NUEVO LOG PARA VERIFICAR MULTER ===
        console.log("--- LOG MULTER ---");
        console.log("req.file:", req.file); 
        console.log("------------------");
        // =======================================

        // 1. Procesar la Imagen (si existe)
        if (req.file && req.file.path) {
            // Usamos la variable renombrada 'cloudinaryUtils' y la carpeta requerida
            const result = await cloudinaryUtils.uploadImage(req.file.path, folderName);
            
            if (result && result.secure_url) {
                imagen_url = result.secure_url;
                img_id = result.public_id; // <-- Asignamos a img_id
            } else {
                return res.status(500).json({ error: 'Error al subir la imagen a Cloudinary (Resultado inesperado).' });
            }
        }

        // 2. Preparar el objeto para la DB
        const obj = {
            titulo, 
            subtitulo, 
            cuerpo, 
            imagen_url, // URL de la imagen (de Cloudinary o vacía)
            img_id   // ID público de Cloudinary (o vacío)
        };

        // 3. Insertar en la Base de Datos
        const response = await novedadesModel.insertNovedad(obj);

        // 4. Respuesta de éxito
        res.status(201).json({ 
            success: true, 
            message: 'Novedad creada exitosamente.',
            id: response.insertId,
            ...obj // Devolvemos los datos insertados
        });

    } catch (error) {
        console.error("-------------------------------------------------------");
        console.error("FATAL Error en POST /api/novedades/agregar:", error); // Imprime el objeto de error completo
        console.error("-------------------------------------------------------");
        
        // Si el error es una instancia de Error de Cloudinary o de la DB, aquí lo capturaremos.
        res.status(500).json({ 
            error: 'Error interno del servidor al crear la novedad. (Revisar terminal del backend para detalles)',
            detail: error.message || 'Error desconocido' 
        });
    }
});

// ===========================================
// 4. ENDPOINT PROTEGIDO para modificar una novedad
// PUT /api/novedades/:id
// REQUIERE: Token, Contenido, y Opcionalmente una nueva imagen
// ===========================================
router.put('/novedades/:id', verifyToken, upload.single('imagen'), async (req, res, next) => {
    try {
        const id = req.params.id;
        const folderName = "hardwarewhite_novedades"; // Carpeta de destino en Cloudinary

        // 1. Obtener la novedad existente para ver si tiene una imagen anterior
        const novedadOriginal = await novedadesModel.getNovedadById(id);

        if (!novedadOriginal) {
            return res.status(404).json({ error: 'Novedad no encontrada.' });
        }

        let obj = req.body; // El objeto con los nuevos datos de texto
        
        // Mantener la imagen original por defecto
        obj.imagen_url = novedadOriginal.imagen_url;
        obj.img_id = novedadOriginal.img_id; // <-- Usamos img_id

        // 2. Procesar la NUEVA Imagen (si se subió un nuevo archivo)
        if (req.file && req.file.path) {
            // A. Si había una imagen anterior, la borramos de Cloudinary
            if (novedadOriginal.img_id) { // <-- Usamos img_id
                // Usamos la variable renombrada 'cloudinaryUtils'
                await cloudinaryUtils.deleteImage(novedadOriginal.img_id); 
                console.log(`Imagen anterior borrada: ${novedadOriginal.img_id}`);
            }

            // B. Subimos la nueva imagen
            // Usamos la variable renombrada 'cloudinaryUtils' y la carpeta requerida
            const result = await cloudinaryUtils.uploadImage(req.file.path, folderName);

            if (result && result.secure_url) {
                // Actualizamos los campos de la imagen con la nueva información
                obj.imagen_url = result.secure_url;
                obj.img_id = result.public_id; // <-- Actualizamos img_id
            } else {
                return res.status(500).json({ error: 'Error al subir la nueva imagen a Cloudinary.' });
            }
        } else if (req.body.imagen_delete === '1') {
             // 3. Procesar Borrado de Imagen (si el cliente lo pide explícitamente y NO sube una nueva)
             if (novedadOriginal.img_id) { // <-- Usamos img_id
                 // Usamos la variable renombrada 'cloudinaryUtils'
                await cloudinaryUtils.deleteImage(novedadOriginal.img_id); 
                console.log(`Imagen eliminada por petición del usuario: ${novedadOriginal.img_id}`);
            }
            // Limpiamos los campos en la DB
            obj.imagen_url = '';
            obj.img_id = ''; // <-- Limpiamos img_id
        }

        // 4. Modificar en la Base de Datos
        await novedadesModel.modificarNovedadById(obj, id);

        // 5. Respuesta de éxito
        res.json({ 
            success: true, 
            message: `Novedad con ID ${id} modificada exitosamente.`,
            ...obj
        });

    } catch (error) {
        console.error(`Error en PUT /api/novedades/${req.params.id}:`, error);
        res.status(500).json({ error: 'Error interno del servidor al modificar la novedad.' });
    }
});


// ===========================================
// 5. ENDPOINT PROTEGIDO para eliminar una novedad
// DELETE /api/novedades/:id
// REQUIERE: Token
// ===========================================
router.delete('/novedades/:id', verifyToken, async (req, res, next) => {
    try {
        const id = req.params.id;
        
        // 1. Obtener la novedad para revisar si tiene una imagen
        const novedad = await novedadesModel.getNovedadById(id);

        if (!novedad) {
            return res.status(404).json({ error: 'Novedad no encontrada para eliminar.' });
        }

        // 2. Si la novedad tiene img_id, la eliminamos de Cloudinary
        if (novedad.img_id) { // <-- Usamos img_id
            // Usamos la variable renombrada 'cloudinaryUtils'
            await cloudinaryUtils.deleteImage(novedad.img_id); 
            console.log(`Imagen eliminada de Cloudinary: ${novedad.img_id}`);
        }

        // 3. Eliminar de la Base de Datos
        await novedadesModel.deleteNovedadById(id);

        // 4. Respuesta de éxito
        res.json({ 
            success: true, 
            message: `Novedad con ID ${id} eliminada exitosamente.`
        });

    } catch (error) {
        console.error(`Error en DELETE /api/novedades/${req.params.id}:`, error);
        res.status(500).json({ error: 'Error interno del servidor al eliminar la novedad.' });
    }
});


// ===========================================
// 99. EXPORTACIÓN OBLIGATORIA DEL ROUTER
// ===========================================
module.exports = router;