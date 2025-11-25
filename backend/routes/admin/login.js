var express = require('express');
var router = express.Router();
// Importamos el Modelo de Usuarios para la autenticación
var usuariosModel = require('./../../models/usuariosModel'); 

// GET /admin/login/ -> Muestra el formulario (Paso 8)
router.get('/', function(req, res, next) {
  res.render('admin/login', {
    layout: 'admin/layout' // Usamos el layout de administración
  });
});

// POST /admin/login/ -> Procesa la autenticación (Paso 11)
router.post('/', async (req, res, next) => {
  try {
    // 1. Captura de datos del formulario (req.body.usuario y req.body.password)
    var usuario = req.body.usuario;
    var password = req.body.password;

    // 2. Llamar al modelo: getUserByUsernameAndPassword
    var data = await usuariosModel.getUserByUsernameAndPassword(usuario, password);

    if (data) {
      // 3. Autenticación exitosa
      // Crear variables de sesión para identificar al usuario
      req.session.id_usuario = data.id; 
      req.session.nombre = data.usuario; 
      
      // 4. Redirigir a la página de inicio del administrador
      res.redirect('/admin/novedades'); 
    } else {
      // 5. Autenticación fallida
      // Renderizar la misma vista, enviando una variable de error
      res.render('admin/login', {
        layout: 'admin/layout',
        error: true // Esta variable se usa en la vista para mostrar el mensaje
      });
    }

  } catch (error) {
    console.log(error);
    res.render('admin/login', {
        layout: 'admin/layout',
        error: true // Mostrar error si falla la conexión a BD o el try/catch
      });
  }
});

router.get('/logout', function(req, res, next) {
    // 1. Destruye la sesión por completo
    req.session.destroy(); 
    
    // 2. Redirige al usuario al login
    res.redirect('/admin/login');
});

module.exports = router;

