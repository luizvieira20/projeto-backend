const {sequelize} = require("../Model/bd");
var express = require('express');
var router = express.Router();

const UsuarioService = require('../Model/Usuarios');

// Instalador
router.get('/install', async function(req, res, next) {
    await sequelize.sync({force: true});
  
    await UsuarioService.novo("Luiz","luiz123@gmail.com", "123456", 0);
    await UsuarioService.novo("Admin","admin@gmail.com", "123456", 1);
  
    res.json({msg: "Instalado com sucesso!"});
  });

  module.exports = router;