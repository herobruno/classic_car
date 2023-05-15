class Carro {
  // Classe que representa um carro, com seus atributos e métodos
  constructor(marca, preco, localizacao, descricao, imagem) {
    // Método construtor, que recebe os atributos do carro e os atribui à instância
    this.marca = marca;
    this.preco = preco;
    this.localizacao = localizacao;
    this.descricao = descricao;
    this.imagem = imagem;
  }

  // Métodos getters para acessar os atributos do carro
  getMarca() {
    return this.marca;
  }

  getPreco() {
    return this.preco;
  }

  getLocalizacao() {
    return this.localizacao;
  }

  getDescricao() {
    return this.descricao;
  }

  getImagem() {
    return this.imagem;
  }
}
  
const carro1 = new Carro('Fusca', 'R$ 45.000', 'Rio de Janeiro', ['Um clássico em excelente estado de conservação.'], '../public/assets/carro3.png');
const carro2 = new Carro('Chevette', 'R$ 65.433', 'Santiago', ['Sed facilisis nisi ac dolor gravida consequat.'], '../public/assets/carro1.webp');
  
  // Exportação da classe para ser utilizada em outros arquivos
  module.exports = Carro;
