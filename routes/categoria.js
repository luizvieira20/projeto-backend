var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');

require("dotenv").config();
const UsuarioService = require('../model/Usuarios');
const CategoriaService = require('../model/Categorias');
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

// Apagar Categoria
 router.delete('/categoria/deletar/:id', async (req, res) => {
  try{
    const token = req.headers.authorization.split(' ')[1];
    const conta = await verificaTokenJWT(token);
    if(conta != null){
        const categId = await CategoriaService.getById(req.params.id);
  
        if(categId){
          const inst = await InstrumentosService.listarPorId(req.params.id);
          console.log(inst)

          for (let i = 0; i < inst.length; i++) {
            await InstrumentosService.deletar(inst[i].id)
          }

          await CategoriaService.deletar(req.params.id);
          res.json({msg: 'Categoria excluída com sucesso'});
        }else{
            res.status(403).json({msg: "Erro, categoria inexistente!"});
        }
    }else{
        res.status(403).json({msg: "Erro, token inválido!"});
    }
  }catch (error) {
    res.status(400).json({mensagem: "Erro ao apagar categoria, faça login.", error});
  }
 });

 // Cadastrar categoria
router.post('/categoria/cadastro', async (req, res) => {
    try{
      const token = req.headers.authorization.split(' ')[1];
      const conta = await verificaTokenJWT(token);
      const { categoria } = req.body;

      if(conta != null){
          if (categoria === null) res.json('Erro. Por favor, preencha o campo.');

            const categ = await CategoriaService.getByName(categoria);
            
            if(categ){
              res.status(403).json({msg: "Erro, categoria já cadastrada!"})
            }else{
              let c = await CategoriaService.novo(categoria);
              res.json({mensagem: "Categoria cadastrada com sucesso!", c});
            }
      }else{
        res.status(403).json({msg: "Erro, token inválido!"});
      }
    }catch (error) {
      res.status(400).json({mensagem: "Erro ao cadastrar categoria, faça login.", error});
    }
  });

  // Listar Categorias

router.get("/categoria/listar/pagina:id", async (req, res) => {
    await CategoriaService.listar(req.params.id, 5).then((categorias) => {
        res.json({categorias})
    })
})

  module.exports = router;