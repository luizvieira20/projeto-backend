var express = require('express');
var router = express.Router();

const {sequelize} = require("../Model/bd");
const UsuarioService = require('../Model/Usuarios');

// Instalador
router.get('/install', async function(req, res, next) {
  await sequelize.sync({force: true});

  let usuario = await UsuarioService.novo("Luiz", "luiz123@gmail.com", "123456");

  res.json({msg: "Instalado com sucesso!", usuario});
});

// Cadastro
router.post('/', async (req, res) => {
  const { nome, email, senha } = req.body;

  try{
    let usuario = await UsuarioService.novo(nome, email, senha);
    res.json({mensagem: "Cadastrado com sucesso!", usuario});
  } catch (error) {
    res.status(400).json({mensagem: "Erro ao cadastrar usuario!", error});
  }

});

module.exports = router;
