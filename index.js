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
const viewsPath = __dirname + '/views';

// Lista de nomes de arquivos EJS
const fileNames = ['cadastro.ejs', 'index.ejs', 'info.ejs', 'store.ejs'];

// Loop para percorrer os nomes de arquivos
fileNames.forEach(fileName => {
  // Caminho completo para o arquivo EJS
  const filePath = viewsPath + '/' + fileName;

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
    const htmlFilePath = __dirname + '/' + htmlFileName;

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
app.get('/', (req, res) => {
  res.render('index', { carro: carro1 });
});

app.get('/carro2', (req, res) => {
  res.render('index', { carro: carro2 });
});




// Rota inicial
app.get("/", (req, res) => {
  res.render("index");
});
app.get('/cadastro', (req, res) => {
  res.render('cadastro', { errorMessage: null }); 
});

//logica para buscar um carro que esta no poo.js
const carro1 = new Carro('Fusca', 'R$ 45.000', 'Rio de Janeiro', ['Um clássico em excelente estado de conservação.'], '../assets/carro3.png');
const carro2 = new Carro('Chevette', 'R$ 65.433', 'Santiago', ['Sed facilisis nisi ac dolor gravida consequat.'], '../assets/carro1.webp');


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
  app.get("/cadastro", (req, res) => {
    res.render("cadastro.ejs");
  });

// Rota da loja, acessível somente com autenticação do usuário
app.get("/store", userauth, (req, res) => {
  res.render("store.ejs");
});


// Rota para processar o cadastro e login de usuários
app.post('/processar', async (req, res) => {
  
  const email = req.body.email;
  const password = req.body.password;
  const action = req.body.action;

  // Se a ação solicitada for 'register'
  if (action === 'register') {
    // Verifica se o email já existe no banco de dados
    cadastro.findOne({
      where: {
        email: email
      }
    }).then(function(user) {
      if (user) {
        // Se o email já existir, retorna uma mensagem de erro
        res.locals.errorMessage = 'Este endereço de e-mail já está em uso. Por favor, escolha outro endereço de e-mail.';
        res.render('cadastro.ejs');
      } else {
        // Se o email não existir, cria um novo usuário no banco de dados
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);

        cadastro.create({
          email: email,
          password: hash
        }).then(function() {
          // Redireciona o usuário para a página de login após o cadastro bem-sucedido
          res.redirect('/');
        }).catch(function(err) {
          // Se ocorrer um erro no cadastro, define a mensagem de erro e renderiza a página de cadastro
          res.locals.errorMessage = 'Erro ao cadastrar.';
          res.render('cadastro.ejs');
        });
      }
    }).catch(function(err) {
      // Se ocorrer um erro na verificação do email, define a mensagem de erro e renderiza a página de cadastro
      res.locals.errorMessage = 'Erro ao cadastrar.';
      res.render('cadastro.ejs');
    });
  // Se a ação solicitada for 'login'
  } else if (action === 'login') {
    // Busca o usuário no banco de dados
    await cadastro.findOne({
      where: {
        email: email
      }
    }).then(user => {
      if (user != undefined) {
        // Verifica se a senha está correta
        const correct = bcrypt.compareSync(password, user.password);

        if (correct) {
          // Se a senha estiver correta, cria uma sessão de usuário e redireciona para a página principal
          req.session.user = {
            email: user.email,
            id : user.id
          };
          res.redirect('/');
        } else {
          // Se a senha estiver incorreta, define a mensagem de erro e renderiza a página de cadastro
          res.locals.errorMessage = 'Senha incorreta.';
          res.render('cadastro.ejs');
        }
      } else {
        // Se o usuário não for encontrado, define a mensagem de erro e renderiza a página de cadastro
        res.locals.errorMessage = 'Usuário não encontrado.';
        res.render('cadastro.ejs');
      }
    }).catch(function(err) {
      // Se ocorrer um erro na busca do usuário, define a mensagem de erro e renderiza a página de cadastro
      res.locals.errorMessage = 'Erro ao fazer login.';
      res.render('cadastro.ejs');
    });
  } else {
    // Ação inválida
    res.status(400).res.locals.errorMessage = 'Ação inválida';es.render('cadastro.ejs');
  }
});
      


    

  
//Database
connection
    .authenticate()
    .then(() => {
        console.log("Conexão feita com o banco de dados!")
    })
    .catch((msgErro) => {
        console.log(msgErro);
    })



//instancia do servidor
app.listen(3000, () => {
  console.log('Servidor rodando!');
});



