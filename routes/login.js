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

const verificaTokenJWT = async(token) => {
  try{
    const verificado = jwt.verify(token, process.env.SECRET);
    const user = await UsuarioService.verificarEmail(verificado.email);
    return user.dataValues.privilegios; 
  }catch (error) {
    return null;
  }
}

router.delete('/login/:id', async (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  const conta = await verificaTokenJWT(token);
  console.log(conta);
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

module.exports = router;
