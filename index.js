var express = require("express");
var app = express();
const connection = require("./models/db");
const bodyParser = require("body-parser");
const cadastro = require("./models/cadastro");
const sequelize = require("sequelize");
const path = require("path");
const session = require("express-session");
const bcrypt = require("bcryptjs");
const userauth = require("./middlewares/userauth");
const Carro = require('./poo.js');

const ejs = require('ejs');
const fs = require('fs');

// Dados do carro
const carro = new Carro('Marca', 'preco', 'localizacao', 'descricao,imagem');

// Caminho para a pasta de views
const viewsPath = path.join(__dirname, 'views');

// Lista de nomes de arquivos EJS
const fileNames = ['cadastro.ejs', 'index.ejs', 'info.ejs', 'store.ejs'];

// Loop para percorrer os nomes de arquivos
fileNames.forEach(fileName => {
  // Caminho completo para o arquivo EJS
  const filePath = path.join(viewsPath, fileName);

  try {
    // Leitura do arquivo EJS
    const template = fs.readFileSync(filePath, 'utf-8');

    // Dados a serem passados para o EJS
    const data = { carro: carro, errorMessage: '' }; // Passa o objeto 'carro' como propriedade 'carro' no objeto de dados 'data'

    // Renderização do arquivo EJS em HTML
    const html = ejs.render(template, data);

    // Nome do arquivo HTML a ser salvo
    const htmlFileName = fileName.replace('.ejs', '.html');

    // Caminho completo para o arquivo HTML
    const htmlFilePath = path.join(__dirname, htmlFileName);

    // Salvar o HTML gerado em um arquivo
    fs.writeFileSync(htmlFilePath, html, 'utf-8');

    console.log(`Arquivo ${htmlFileName} salvo com sucesso.`);

  } catch (err) {
    console.error(`Erro ao renderizar o arquivo ${fileName}: ${err.message}`);
  }
});


// Configurando a sessão do usuário
app.use(session({
  cookie: { maxAge: 10000000000000000000 },
  secret: 'mySecret',
  resave: false,
  saveUninitialized: true
}));

// Configurando o template engine EJS e a pasta de arquivos estáticos
app.set('view engine', 'ejs');
app.use(express.static('public'));

// Configurando o body-parser para receber dados do formulário via POST
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Criação dos objetos Carro
const carro1 = new Carro('Fusca', 'R$ 45.000', 'Rio de Janeiro', ['Um clássico em excelente estado de conservação.'], '../assets/carro3.png');
const carro2 = new Carro('Chevette', 'R$ 65.433', 'Santiago', ['Sed facilisis nisi ac dolor gravida consequat.'], '../assets/carro1.webp');

// Rota inicial
app.get('/', (req, res) => {
  res.render('index', { carro: carro1 });
});

app.get('/carro2', (req, res) => {
  res.render('index', { carro: carro2 });
});
// Rota para exibir informações do carro
app.get('/info', (req, res) => {
  const searchTerm = req.query.searchTerm;
  let carroEncontrado = null;

  if (searchTerm && searchTerm.toLowerCase() === carro1.getMarca().toLowerCase()) {
    carroEncontrado = carro1;
  } else if (searchTerm && searchTerm.toLowerCase() === carro2.getMarca().toLowerCase()) {
    carroEncontrado = carro2;
  }

  if (carroEncontrado) {
    res.render('info', { carro: carroEncontrado, imagemUrl: carroEncontrado.getImagem() });
  } else {
    res.send('Car not found!');
  }
});

// Rota de cadastro de usuário
app.get('/cadastro', (req, res) => {
  res.render('cadastro', { errorMessage: null });
});

// Rota para processar o cadastro e login de usuários
app.post('/processar', async (req, res) => {
  // Implemente a lógica para processar o cadastro e login de usuários aqui
});

// Rota da loja, acessível somente com autenticação do usuário
app.get('/store', userauth, (req, res) => {
  res.render('store');
});

// Database
connection
  .authenticate()
  .then(() => {
    console.log("Conexão feita com o banco de dados!");
  })
  .catch((msgErro) => {
    console.log(msgErro);
  });

// Instância do servidor
app.listen(3000, () => {
  console.log('Servidor rodando!');
});

