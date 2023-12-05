var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');

require("dotenv").config();
const UsuarioService = require('../Model/Usuarios');

// Verificar Token

const verificaTokenJWT = async(token) => {
    try{
      const verificado = jwt.verify(token, process.env.SECRET);
      const user = await UsuarioService.verificarEmail(verificado.email);
      return user; 
    }catch (error) {
      return null;
    }
}

// Alteração de dados

  router.put('/user/alterar/', async (req, res) => {
    try{
      const token = req.headers.authorization.split(' ')[1];
      const conta = await verificaTokenJWT(token);
      const { usuario, email, senha } = req.body;
  
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
      if(usuario === null || email === null || senha === null){
        res.json({msg: 'Erro. Por favor, preencha todos os campos.'});
      }else if (emailRegex.test(email) === false) res.json({msg: 'Erro. Digite um e-mail válido'});
  
      if(conta != null){
        await conta.update(
            {
                usuario: usuario,
                email: email,
                senha: senha
            },
            {
                where: {
                    id: conta.dataValues.id
                }
            }
        );
        res.json({msg: 'Dados do usuário alterados com sucesso'});
      }else{
        res.status(403).json({msg: "Erro, token inválido!"});
      }
    }catch (error) {
      res.status(400).json({mensagem: "Erro ao alterar dados, faça login.", error});
    }
  });
  
module.exports = router;