// Importa o arquivo de configuração do banco de dados
const db = require("./db");

// Importa a biblioteca Sequelize
const Sequelize = require("sequelize");

// Define o modelo da tabela 'Users'
const cadastro = db.define('Users', {
id: {
type: Sequelize.INTEGER,
autoIncrement: true,
allowNull: false,
primaryKey: true,
},
email: {
type: Sequelize.STRING,
allowNull: false,
},
password: {
type: Sequelize.STRING,
allowNull: false,
}
});

// Exporta o modelo 'cadastro' para ser utilizado em outras partes do código
module.exports = cadastro;