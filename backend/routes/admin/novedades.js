var express = require('express');
var router = express.Router();
var novedadesModel = require('../../models/novedadesModel');
var imagenUtils = require('../../utils/imagenUtils'); // Asegúrate que la ruta es correcta

// ===================================
// 1. GET - LISTADO DE NOVEDADES (Devuelve JSON)
// ===================================
// Esta es la ruta que consume tu componente React/Frontend
router.get('/', async function(req, res, next) {
    try {
        let novedades = await novedadesModel.getNovedades(); 
        res.json(novedades); 
    } catch (error) {
        console.error("Error al cargar el listado de novedades:", error);
        res.status(500).json({
            error: true,
            message: 'No se pudo cargar el listado de novedades (Error de DB o conexión).'
        });
    }
});

// ===================================
// 2. GET - Formulario de Alta (Se mantiene)
// ===================================
router.get('/agregar', (req, res, next) => {
    res.render('admin/agregar', {
        layout: 'admin/layout'
    });
});

// ===================================
// 3. POST - Guardar la Novedad (CORREGIDO: Guarda también la URL)
// ===================================
router.post('/agregar', async (req, res, next) => {
    let obj = {
        titulo: req.body.titulo,
        subtitulo: req.body.subtitulo,
        cuerpo: req.body.cuerpo,
        img_id: '',
        imagen_url: '' // AÑADIDO: Inicializamos el campo para la URL
    };

    try {
        // 1. Validar que los campos de texto no estén vacíos
        if (!obj.titulo || !obj.subtitulo || !obj.cuerpo) { 
            return res.status(400).json({ 
                error: true, 
                message: 'Todos los campos de texto son obligatorios.'
            });
        }
            
        // 2. Si se detecta el campo 'imagen' en los archivos (req.files.imagen)
        if (req.files && req.files.imagen) {
            let imagen = req.files.imagen; 
            const subida = await imagenUtils.subirImagen(imagen); 
            
            // CRÍTICO: Guardamos el ID público y la URL segura
            obj.img_id = subida.public_id;
            obj.imagen_url = subida.secure_url; // <--- CORRECCIÓN CLAVE: Guarda la URL
        }

        // 3. Insertar en la base de datos
        await novedadesModel.insertNovedad(obj); 
        
        res.status(201).json({ success: true, message: 'Novedad agregada correctamente.' });

    } catch (error) {
        console.error('--- ERROR CRÍTICO al agregar novedad ---');
        console.error(error); 
        
        let errorMessage = 'No se pudo cargar la novedad. Error interno del servidor.';
        
        if (error.http_code === 401) {
             errorMessage = 'Error: Credenciales de Cloudinary incorrectas (401).';
        }
        
        res.status(500).json({
            error: true,
            message: errorMessage
        });
    }
});


// =======================================================================
// 4. DELETE - Eliminar Novedad por ID (Mantenido como DELETE)
// =======================================================================
router.delete('/eliminar/:id', async (req, res, next) => { 
    var id = req.params.id; 
    
    try {
        let novedad = await novedadesModel.getNovedadById(id);

        if (novedad && novedad.img_id) {
            try {
                await imagenUtils.eliminarImagen(novedad.img_id);
            } catch (imageError) {
                console.warn('Advertencia: No se pudo eliminar la imagen de Cloudinary:', imageError);
            }
        }

        await novedadesModel.deleteNovedadById(id);
        
        res.json({ success: true, message: `Novedad ID ${id} eliminada correctamente.` });
        
    } catch (error) {
        console.error('--- ERROR CRÍTICO al eliminar novedad (DB) ---');
        console.error(error);
        
        res.status(500).json({ 
            error: true,
            message: `No se pudo eliminar la novedad ID ${id}. Revisar conexión a DB.`
        });
    }
});

// ===================================
// 5. GET y POST - Modificar Novedad (CORREGIDO: Guarda también la URL)
// ===================================

// GET: Cargar formulario de modificación (Se mantiene)
router.get('/modificar/:id', async (req, res, next) => {
    try {
        let id = req.params.id;
        let novedad = await novedadesModel.getNovedadById(id);
        
        res.render('admin/modificar', {
            layout: 'admin/layout',
            novedad
        });
    } catch (error) {
        console.error('Error al cargar formulario de modificación:', error);
        res.redirect('/admin/novedades'); 
    }
});

// POST: Guardar modificación
router.post('/modificar', async (req, res, next) => {
    let id = req.body.id;
    let obj = {
        titulo: req.body.titulo,
        subtitulo: req.body.subtitulo,
        cuerpo: req.body.cuerpo,
        // img_original es el ID de la imagen anterior
        img_id: req.body.img_original, // Valor por defecto: mantiene el ID anterior
        imagen_url: req.body.imagen_url_original || '' // AÑADIDO: Campo para mantener la URL si no se sube nueva imagen
    };

    try {
        // 1. Validar campos
        if (!obj.titulo || !obj.subtitulo || !obj.cuerpo) {
             return res.status(400).json({
                 error: true,
                 message: 'Todos los campos de texto son obligatorios',
             });
        }
            
        // 2. Manejo de la nueva imagen (Chequeo estricto para 'imagen')
        let imagenOriginalID = req.body.img_original; // ID de la imagen anterior
        
        if (req.files && req.files.imagen) { // <-- Si se encontró un NUEVO archivo de imagen
            let imagen = req.files.imagen;
            
            const subida = await imagenUtils.subirImagen(imagen);
            
            // CRÍTICO: Actualiza el ID y la URL con los nuevos valores
            obj.img_id = subida.public_id; 
            obj.imagen_url = subida.secure_url; // <--- CORRECCIÓN CLAVE: Guarda la nueva URL
            
            // Si había una imagen previa, la eliminamos de Cloudinary
            if (imagenOriginalID) {
                 await imagenUtils.eliminarImagen(imagenOriginalID);
            }
        }
        
        // 3. Ejecutar la modificación en la base de datos
        // Si no se subió nueva imagen, obj.img_id ya tiene el ID original e obj.imagen_url tiene la URL original.
        await novedadesModel.modificarNovedadById(obj, id); 
        
        res.json({ success: true, message: 'Novedad modificada correctamente.' });

    } catch (error) {
        console.error('--- ERROR CRÍTICO al modificar novedad ---');
        console.error(error);
        
        let errorMessage = 'No se pudo modificar la novedad. Error interno del servidor.';
        if (error.http_code === 401) {
             errorMessage = 'Error: Credenciales de Cloudinary incorrectas (401).';
        }

        res.status(500).json({
            error: true,
            message: errorMessage
        });
    }
});

module.exports = router;