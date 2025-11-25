var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  // Simplemente renderiza la vista 'index' por defecto
  res.render('index', { title: 'Express' });
});

module.exports = router;