const sequelize = require("../helpers/bd");
var express = require('express');
var router = express.Router();

const UsuarioService = require('../model/Usuarios');
const CategoriaService = require('../model/Categorias');
const InstrumentosService = require('../model/Instrumentos')

// Instalador
router.get('/install', async function(req, res, next) {
    await sequelize.sync({force: true});

    let categorias = [
        "Violão", "Guitarra", "Baixo", "Teclado"
    ]
    
    for (let i = 0; i < categorias.length; i++) {
        await CategoriaService.novo(categorias[i])
    }
  
    await UsuarioService.novo("Admin","admin@gmail.com", "123456", 1);

    await InstrumentosService.novo("Violão", "Yamaha", "A3M Natural")
    await InstrumentosService.novo("Guitarra", "Ibanez", "Roadcore")
    await InstrumentosService.novo("Guitarra", "Ibanez", "RGD")
    await InstrumentosService.novo("Baixo", "Epiphone", "Thunderbird IV")
    await InstrumentosService.novo("Violão", "Memphis", "AC 40 Natural")
    await InstrumentosService.novo("Teclado", "Yamaha", "PS-500 B")
    await InstrumentosService.novo("Baixo", "Alder", "SX Alder SBJ NA")
    await InstrumentosService.novo("Teclado", "Korg", "B2SP-BK")
  
    res.json({msg: "Instalado com sucesso!"});
});

module.exports = router;