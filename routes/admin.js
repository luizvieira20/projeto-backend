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
      return user.dataValues.privilegios; 
    }catch (error) {
      return null;
    }
}

  // Deletar usuário
  
  router.delete('/admin/:id', async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    const conta = await verificaTokenJWT(token);
    if(conta != null){
        if(conta == true){
          const userId = await UsuarioService.verificarId(req.params.id);
  
          if(userId){
            if(userId.privilegios == 0){
              await userId.destroy();
              res.json({msg: 'Usuário excluído com sucesso'});
            }else{
              res.status(403).json({msg: "Erro, impossível apagar outro usuário administrador"});
            }
          }else{
            res.status(403).json({msg: "Erro, usuário inexistente!"});
          }
        }else{
          res.status(403).json({msg: "Erro, permissão negada!"});
        }
    }else {
      res.status(403).json({msg: "Erro, token inválido!"});
    }
  });

  //Criar outro administrador
  
  router.post('/admin/cadastro', async (req, res) => {
    try{
    const token = req.headers.authorization.split(' ')[1];
    const conta = await verificaTokenJWT(token);
    const { usuario, email, senha } = req.body;

    if(conta != null){
        if(conta == true){
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
            if (usuario.lenght === 0 || email.length === 0 || senha.length === 0){
                res.json('Erro. Por favor, preencha todos os campos.');
            }else if (emailRegex.test(email) === false) res.json('Erro. Digite um e-mail válido');

            const existente = await UsuarioService.verificarEmail(email);
            
            if(existente){
              res.status(403).json({msg: "Erro, email já cadastrado!"})
            }else{
              let user = await UsuarioService.novo(usuario, email, senha, 1);
              res.json({mensagem: "Administrador cadastrado com sucesso!", user});
            }
        }else{
            res.status(403).json({msg: "Erro, permissão negada!"});
        }
    }else{
        res.status(403).json({msg: "Erro, token inválido!"});
    }
    }catch (error) {
        res.status(400).json({mensagem: "Erro ao cadastrar administrador!", error});
    }
});

  module.exports = router;