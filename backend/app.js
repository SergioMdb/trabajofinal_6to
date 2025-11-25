// ===================================
// 1. IMPORTS Y CONFIGURACIÓN INICIAL
// ===================================

// Carga las variables de entorno del archivo .env
require('dotenv').config(); 

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var fileUpload = require('express-fileupload');
var cors = require('cors'); // Para la API Rest
var jwt = require('jsonwebtoken'); // Importar JWT para la verificación de tokens

// -> INICIO: AJUSTES PARA CLOUDINARY
var cloudinary = require('cloudinary').v2; // Importar Cloudinary SDK
// -> FIN: AJUSTES PARA CLOUDINARY

// Importación de Routers
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var loginRouter = require('./routes/admin/login'); // Router para Login/Logout
var novedadesRouter = require('./routes/admin/novedades'); // Router para CRUD de Novedades
var apiRouter = require('./routes/api'); // Router para la API Rest pública

var app = express();

// -> INICIO: CONFIGURACIÓN DE CLOUDINARY
// Se configura Cloudinary con las credenciales cargadas desde el archivo .env
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
// -> FIN: CONFIGURACIÓN DE CLOUDINARY

// ===================================
// 2. MIDDLEWARE SECURED (PROTECCIÓN)
// ===================================

// Función middleware para proteger las rutas de administración (Adaptada para JWT)
var secured = async (req, res, next) => {
    try {
        // -------------------------------------------------------------------
        // 1. VERIFICACIÓN DE SESIÓN (Para rutas de Plantillas, ej. Handlebars)
        // -------------------------------------------------------------------
        if (req.session && req.session.id_usuario) {
            console.log('Autenticación por SESIÓN exitosa.');
            return next();
        }

        // -------------------------------------------------------------------
        // 2. VERIFICACIÓN DE TOKEN JWT (Para rutas de API Rest del Frontend)
        // -------------------------------------------------------------------
        const authHeader = req.headers.authorization;
        
        if (authHeader) {
            const token = authHeader.split(' ')[1]; // Espera formato "Bearer <token>"
            
            if (token) {
                try {
                    // Verificar el token usando la CLAVE SECRETA de JWT
                    const decoded = jwt.verify(token, process.env.JWT_KEY || 'mi_clave_secreta_para_jwt');
                    req.user = decoded; // Adjuntar datos del usuario al request
                    console.log('Autenticación por TOKEN JWT exitosa.');
                    return next();

                } catch (jwtError) {
                    console.error('Error de verificación JWT:', jwtError.message);
                    // Token inválido o expirado
                    return res.status(401).json({ error: 'Token inválido o expirado.' });
                }
            }
        }

        // -------------------------------------------------------------------
        // 3. FALLO DE AUTENTICACIÓN
        // -------------------------------------------------------------------

        // Si fallan ambos métodos (sesión y token), redirigir o devolver 401
        // Para las peticiones que no son de API, redirigir
        if (req.originalUrl.startsWith('/admin')) {
              return res.redirect('/admin/login');
        } 
        
        // Para las peticiones que se asumen de API (aunque protegidas), devolver 401
        return res.status(401).json({ error: 'Acceso no autorizado. Se requiere autenticación.' });
        
    } catch (error) {
        console.error("Error en el middleware secured:", error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
}

// ===================================
// 3. CONFIGURACIÓN DE MIDDLEWARES
// ===================================

// Configuración de Handlebars (asumiendo que ya la tienes)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// Middlewares estándar
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Middleware de Subida de Archivos (Paso 29)
// Es crucial que 'express-fileupload' esté configurado para manejar archivos
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/' // Directorio temporal
}));

// Middleware de CORS (Paso 34): Necesario para que el frontend acceda a la API
app.use(cors());

// Middleware de Sesión (Paso 9)
app.use(session({
    secret: 'claveSuperSecretaParaSesiones', // CLAVE DE SEGURIDAD: Cámbiala!
    cookie: { maxAge: null }, 
    resave: false,
    saveUninitialized: true
}));


// ===================================
// 4. DEFINICIÓN DE RUTAS
// ===================================

app.use('/', indexRouter);
app.use('/users', usersRouter);

// NOTA IMPORTANTE: La ruta de login de la API está en /api, no en /admin/login. 
// La ruta /admin/login es solo para la interfaz de plantilla si la tienes.
app.use('/admin/login', loginRouter); 

// Rutas de Administración Protegidas: Aplica el middleware 'secured' (Paso 14)
// Esto protegerá tus rutas CRUD de novedades
app.use('/admin/novedades', secured, novedadesRouter);

// Ruta de la API Pública: NO lleva 'secured' (Paso 36)
// Nota: Si una ruta de API requiere protección, debes aplicarle 'secured' también, 
// como las de agregar/modificar/eliminar novedades que deberían estar protegidas.
// Si las rutas CRUD protegidas están en 'apiRouter', el middleware 'secured' 
// DEBE ser aplicado directamente en ese router.

// Ejemplo: Si quieres proteger /api/novedades/agregar, la definición de la ruta DEBE
// ser app.use('/api', secured, apiRouter) o aplicar 'secured' dentro de api.js.
// Por ahora, asumo que las rutas sensibles están protegidas individualmente en api.js
app.use('/api', apiRouter);


// ===================================
// 5. MANEJO DE ERRORES
// ===================================

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});


// ===================================
// 6. INICIO DEL SERVIDOR (LISTENER)
// ===================================

const PORT = process.env.PORT || 3000; // Usa la variable de entorno PORT o 3000 por defecto

app.listen(PORT, () => {
    console.log(`🎉 Backend corriendo en el puerto: ${PORT}`);
});


module.exports = app; // Exporta el objeto app