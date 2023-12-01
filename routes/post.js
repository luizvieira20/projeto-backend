var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
const swaggerUI = require('swagger-ui-express');
const swaggerFile = require('../swagger_doc.json');
require("dotenv").config();

const {sequelize} = require("../Model/bd");
const UsuarioService = require('../Model/Usuarios');

// Instalador
router.get('/install', async function(req, res, next) {
  await sequelize.sync({force: true});

  await UsuarioService.novo("Luiz","luiz123@gmail.com", "123456", 0);
  await UsuarioService.novo("Admin","admin@gmail.com", "123456", 1);

  res.json({msg: "Instalado com sucesso!"});
});

// Documentação
router.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerFile));

// Cadastro
router.post('/cadastro', async (req, res) => {

  try{
    const { usuario, email, senha } = req.body;
    let user = await UsuarioService.novo(usuario, email, senha, 0);
    res.json({mensagem: "Cadastrado com sucesso!", user});
  } catch (error) {
    res.status(400).json({mensagem: "Erro ao cadastrar usuario!", error});
  }

});

// Login
router.post('/login', (req, res) => {
  const { usuario, senha } = req.body;

  if (usuario === 'Admin' && senha === '123456') {
    const token = jwt.sign({ usuario: usuario, role: 'admin' }, process.env.SECRET, { expiresIn: '1h' });
    res.status(200).json({auth: true, token: token });
  } else {
    res.status(401).send('Credenciais inválidas. Falha na autenticação.');
  }
});

// Rota protegida que requer o token JWT para acesso
router.get('/rota-protegida', verificarTokenJWT, (req, res) => {
  res.status(200).send('Você tem acesso a esta rota protegida.');
});

// Middleware para verificar o token JWT
function verificarTokenJWT(req, res, next) {
  const token = req.headers.authorization;
  if (token) {
    jwt.verify(token, process.env.SECRET, (err, decoded) => {
      if (err) {
        return res.status(500).send({auth: false, mensagem: 'Token inválido. Falha na autenticação.'});
      } else {
        next();
      }
    });
  } else {
    res.status(401).send('Token não fornecido. Falha na autenticação.');
  }
}

module.exports = router;
