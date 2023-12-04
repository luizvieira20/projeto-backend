const { UsuarioModel } = require('./bd');

module.exports = {
    novo: async (usuario, email, senha, privilegios) => {
        return await UsuarioModel.create({usuario: usuario, email: email, senha: senha, privilegios: privilegios });
    },
    verificarEmail: async (email) => {
        return await UsuarioModel.findOne({where: {email: email}});
    },
    verificarId: async (id) => {
        return await UsuarioModel.findOne({where: {id: id}});
    }
}