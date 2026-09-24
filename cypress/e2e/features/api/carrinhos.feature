# language: pt
@api @regression
Funcionalidade: Carrinho de compras pela API
  Como cliente autenticado
  Quero montar, concluir ou cancelar um carrinho
  Para comprar produtos respeitando o estoque disponível

  Contexto:
    Dado que existe um administrador autenticado
    E que existe um produto cadastrado com estoque de 10 unidades
    E que existe um usuário comum autenticado

  @smoke
  Cenário: Criar um carrinho com um produto disponível
    Quando o usuário comum cria um carrinho com 3 unidades do produto
    Então a resposta deve ter status 201
    E a resposta deve respeitar o contrato de "cadastro com sucesso"
    E o carrinho consultado deve ter 3 unidades do produto e o total calculado pelo preço unitário
    E o estoque do produto deve ser de 7 unidades

  Cenário: Recusar um segundo carrinho para o mesmo usuário
    Dado que o usuário comum já possui um carrinho com 1 unidade do produto
    Quando o usuário comum cria um carrinho com 1 unidade do produto
    Então a resposta deve ter status 400
    E a resposta deve conter a mensagem "Não é permitido ter mais de 1 carrinho"

  Cenário: Recusar carrinho com quantidade acima do estoque
    Quando o usuário comum cria um carrinho com 11 unidades do produto
    Então a resposta deve ter status 400
    E a resposta deve conter a mensagem "Produto não possui quantidade suficiente"
    E o estoque do produto deve ser de 10 unidades

  Cenário: Recusar carrinho com produto inexistente
    Quando o usuário comum cria um carrinho com um produto inexistente
    Então a resposta deve ter status 400
    E a resposta deve conter a mensagem "Produto não encontrado"

  Cenário: Recusar criação de carrinho sem autenticação
    Quando tento criar um carrinho sem informar o token
    Então a resposta deve ter status 401
    E a resposta deve conter a mensagem "Token de acesso ausente, inválido, expirado ou usuário do token não existe mais"

  Cenário: Cancelar a compra devolve os produtos ao estoque
    Dado que o usuário comum já possui um carrinho com 4 unidades do produto
    Quando o usuário comum cancela a compra
    Então a resposta deve ter status 200
    E a resposta deve conter a mensagem "Registro excluído com sucesso. Estoque dos produtos reabastecido"
    E o carrinho não deve mais existir
    E o estoque do produto deve ser de 10 unidades

  Cenário: Concluir a compra remove o carrinho e mantém a baixa no estoque
    Dado que o usuário comum já possui um carrinho com 4 unidades do produto
    Quando o usuário comum conclui a compra
    Então a resposta deve ter status 200
    E a resposta deve conter a mensagem "Registro excluído com sucesso"
    E o carrinho não deve mais existir
    E o estoque do produto deve ser de 6 unidades

  Cenário: Cancelar a compra sem possuir carrinho
    Quando o usuário comum cancela a compra
    Então a resposta deve ter status 200
    E a resposta deve conter a mensagem "Não foi encontrado carrinho para esse usuário"
