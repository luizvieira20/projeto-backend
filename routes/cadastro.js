var express = require('express');
var router = express.Router();

const UsuarioService = require('../Model/Usuarios');

// Cadastro
router.post('/cadastro', async (req, res) => {

    try{
      const { usuario, email, senha } = req.body;

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
      if (usuario.lenght || email.length === 0 || senha.length === 0) res.json('Erro. Por favor, preencha todos os campos.');
      else if (emailRegex.test(email) === false) res.json('Erro. Digite um e-mail válido');

      const existente = await UsuarioService.verificarEmail(email);
      if(existente){
        res.status(403).json({msg: "Erro, email já cadastrado!"})
      }else{
        let user = await UsuarioService.novo(usuario, email, senha, 0);
        res.json({mensagem: "Cadastrado com sucesso!", user});
      }
    } catch (error) {
      res.status(400).json({mensagem: "Erro ao cadastrar usuario!", error});
    }
  
});

module.exports = router;