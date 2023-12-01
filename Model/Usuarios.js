const { UsuarioModel } = require('./bd');

module.exports = {
    novo: async (nome, email, senha) => {
        return await UsuarioModel.create({nome: nome, email: email, senha: senha });
    }
}