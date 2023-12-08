var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');

require("dotenv").config();
const UsuarioService = require('../model/Usuarios');
const InstrumentosService = require('../model/Instrumentos');

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

// Apagar Instrumento
 router.delete('/instrumentos/deletar/:id', async (req, res) => {
  try{
    const token = req.headers.authorization.split(' ')[1];
    const conta = await verificaTokenJWT(token);
    if(conta != null){
        const instId = await InstrumentosService.getById(req.params.id);
  
        if(instId){
            await InstrumentosService.deletar(req.params.id);
            res.json({msg: 'Instrumento excluído com sucesso'});
        }else{
            res.status(403).json({msg: "Erro, instrumento inexistente!"});
        }
    }else{
        res.status(403).json({msg: "Erro, token inválido!"});
    }
  }catch (error) {
    res.status(400).json({mensagem: "Erro ao apagar instrumento, faça login.", error});
  }
 });

 // Cadastrar instrumento
router.post('/instrumentos/cadastro', async (req, res) => {
    try{
      const token = req.headers.authorization.split(' ')[1];
      const conta = await verificaTokenJWT(token);
      const { categoria, marca, modelo } = req.body;

      if(conta != null){
        if (categoria === null || marca === null || modelo === null) res.json('Erro. Por favor, preencha os campos.');
          let i = await InstrumentosService.novo(categoria, marca, modelo);
          res.json({mensagem: "Instrumento cadastrado com sucesso!", i});
      }else{
        res.status(403).json({msg: "Erro, token inválido!"});
      }
    }catch (error) {
      res.status(400).json({mensagem: "Erro ao cadastrar instrumento, faça login.", error});
    }
  });

  // Listar Instrumentos

router.get("/instrumentos/listar", async (req, res) => {
    await InstrumentosService.listar().then((instrumentos) => {
        res.json({instrumentos})
    })
})

 // Listar Instrumentos por Id

 router.get("/instrumentos/listar-por-categoria/:id", async (req, res) => {
    await InstrumentosService.listarPorId(req.params.id).then((instrumentos) => {
        res.json({instrumentos})
    })
})

  module.exports = router;