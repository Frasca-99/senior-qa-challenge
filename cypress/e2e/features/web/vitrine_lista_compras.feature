# language: pt
@web @regression
Funcionalidade: Vitrine e lista de compras
  Como cliente autenticado na loja
  Quero pesquisar produtos e montar minha lista de compras
  Para escolher o que vou comprar

  Contexto:
    Dado que existe um administrador autenticado
    E que existe um produto cadastrado
    E que estou autenticado na loja como um usuário comum

  @smoke
  Cenário: Pesquisar um produto pelo nome
    Quando pesquiso pelo nome do produto cadastrado
    Então a vitrine deve exibir somente esse produto com o seu preço

  Cenário: Pesquisar um produto inexistente
    Quando pesquiso por um produto inexistente
    Então a vitrine deve informar que nenhum produto foi encontrado

  Cenário: Adicionar um produto à lista de compras
    Quando pesquiso pelo nome do produto cadastrado
    E adiciono o produto cadastrado à lista de compras
    Então devo ser direcionado para a lista de compras
    E a lista deve exibir o produto cadastrado com o seu preço e total de 1 unidade

  Cenário: Ajustar a quantidade de um produto na lista de compras
    Dado que o produto cadastrado está na lista de compras
    Quando aumento a quantidade do produto 2 vezes
    Então a lista deve exibir o total de 3 unidades
    Quando diminuo a quantidade do produto 1 vez
    Então a lista deve exibir o total de 2 unidades

  Cenário: Limpar a lista de compras
    Dado que o produto cadastrado está na lista de compras
    Quando limpo a lista de compras
    Então a lista deve informar que está vazia
