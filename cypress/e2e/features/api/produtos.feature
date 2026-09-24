# language: pt
@api @regression
Funcionalidade: Cadastro de produtos pela API
  Como administrador da loja
  Quero cadastrar, consultar e excluir produtos
  Para manter o catálogo disponível na vitrine

  Contexto:
    Dado que existe um administrador autenticado

  @smoke
  Cenário: Cadastrar um produto como administrador
    Quando cadastro um novo produto via API
    Então a resposta deve ter status 201
    E a resposta deve respeitar o contrato de "cadastro com sucesso"
    E o produto deve ser consultável pelo id retornado com os dados cadastrados

  Cenário: Recusar cadastro de produto sem autenticação
    Quando tento cadastrar um produto sem informar o token
    Então a resposta deve ter status 401
    E a resposta deve conter a mensagem "Token de acesso ausente, inválido, expirado ou usuário do token não existe mais"

  Cenário: Recusar cadastro de produto por usuário que não é administrador
    Dado que existe um usuário comum autenticado
    Quando tento cadastrar um produto com o token do usuário comum
    Então a resposta deve ter status 403
    E a resposta deve conter a mensagem "Rota exclusiva para administradores"

  Cenário: Recusar cadastro de produto com nome já utilizado
    Dado que existe um produto cadastrado
    Quando tento cadastrar outro produto com o mesmo nome
    Então a resposta deve ter status 400
    E a resposta deve conter a mensagem "Já existe produto com esse nome"

  Esquema do Cenário: Recusar cadastro de produto com campo inválido
    Quando tento cadastrar um produto com o campo "<campo>" igual a "<valor>"
    Então a resposta deve ter status 400
    E a resposta deve apontar o erro "<mensagem>" no campo "<campo>"

    Exemplos:
      | campo      | valor | mensagem                                 |
      | nome       |       | nome não pode ficar em branco            |
      | preco      | 0     | preco deve ser um número positivo        |
      | descricao  |       | descricao não pode ficar em branco       |
      | quantidade | -1    | quantidade deve ser maior ou igual a 0   |

  Cenário: Listar produtos filtrando pelo nome
    Dado que existe um produto cadastrado
    Quando listo os produtos filtrando pelo nome desse produto
    Então a resposta deve ter status 200
    E a resposta deve respeitar o contrato de "lista de produtos"
    E a lista deve conter exatamente o produto cadastrado

  Cenário: Excluir um produto existente
    Dado que existe um produto cadastrado
    Quando excluo esse produto via API
    Então a resposta deve ter status 200
    E a resposta deve conter a mensagem "Registro excluído com sucesso"
    E a consulta do produto deve responder 400 com a mensagem "Produto não encontrado"
