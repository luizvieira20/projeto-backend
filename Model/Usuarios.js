const { UsuarioModel } = require('./bd');

module.exports = {
    novo: async (usuario, email, senha, privilegios) => {
        return await UsuarioModel.create({usuario: usuario, email: email, senha: senha, privilegios: privilegios });
    }
}