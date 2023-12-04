var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');

require("dotenv").config();
const UsuarioService = require('../Model/Usuarios');

// Login
router.post('/login', async(req, res) => {
  const { email, senha } = req.body;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
  if (email.length === 0 || senha.length === 0) res.json('Erro. Por favor, preencha todos os campos.');
  else if (emailRegex.test(email) === false) res.json('Erro. Digite um e-mail válido');

  const user = await UsuarioService.verificarEmail(email);

  if(user){
    if(user.senha == senha){
        if (user.privilegios == 0 ) {
            const token = jwt.sign({ email: email, senha: senha}, process.env.SECRET, { expiresIn: '1h' });
            res.status(200).json({msg: "Logado como usuario normal", auth: true, token: token });
        } else if(user.privilegios == 1) {
            const token = jwt.sign({ email: email, senha: senha, role: 'admin' }, process.env.SECRET, { expiresIn: '1h' });
            res.status(200).json({msg: "Logado como admin", auth: true, token: token });
        }
    }else{
        res.status(403).json({msg: "Credenciais inválidas!"});
    }
  }else res.status(403).json({msg: "Usuário não encontrado"});
});

module.exports = router;
