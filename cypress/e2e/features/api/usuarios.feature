# language: pt
@api @regression
Funcionalidade: Cadastro de usuários pela API
  Como consumidor da API do ServeRest
  Quero cadastrar, consultar, editar e excluir usuários
  Para gerenciar quem acessa a loja

  @smoke
  Cenário: Cadastrar um novo usuário com dados válidos
    Quando cadastro um novo usuário via API
    Então a resposta deve ter status 201
    E a resposta deve respeitar o contrato de "cadastro com sucesso"
    E o usuário deve ser consultável pelo id retornado com os dados cadastrados

  Cenário: Recusar cadastro com e-mail já utilizado
    Dado que existe um usuário cadastrado
    Quando tento cadastrar outro usuário com o mesmo e-mail
    Então a resposta deve ter status 400
    E a resposta deve conter a mensagem "Este email já está sendo usado"
    E a resposta deve respeitar o contrato de "mensagem"

  Esquema do Cenário: Recusar cadastro com campo inválido
    Quando tento cadastrar um usuário com o campo "<campo>" igual a "<valor>"
    Então a resposta deve ter status 400
    E a resposta deve apontar o erro "<mensagem>" no campo "<campo>"

    Exemplos:
      | campo         | valor           | mensagem                                  |
      | nome          |                 | nome não pode ficar em branco             |
      | email         | email-invalido  | email deve ser um email válido            |
      | password      |                 | password não pode ficar em branco         |
      | administrador | talvez          | administrador deve ser 'true' ou 'false'  |

  Cenário: Recusar cadastro sem informar nenhum campo
    Quando tento cadastrar um usuário sem informar nenhum campo
    Então a resposta deve ter status 400
    E a resposta deve apontar como obrigatórios os campos:
      | nome          |
      | email         |
      | password      |
      | administrador |

  Cenário: Editar os dados de um usuário existente
    Dado que existe um usuário cadastrado
    Quando altero o nome e a senha desse usuário via API
    Então a resposta deve ter status 200
    E a resposta deve conter a mensagem "Registro alterado com sucesso"
    E a consulta do usuário deve refletir os dados alterados

  Cenário: Excluir um usuário existente
    Dado que existe um usuário cadastrado
    Quando excluo esse usuário via API
    Então a resposta deve ter status 200
    E a resposta deve conter a mensagem "Registro excluído com sucesso"
    E a consulta do usuário deve responder 400 com a mensagem "Usuário não encontrado"

  Cenário: Consultar um usuário inexistente
    Quando consulto um usuário com id inexistente
    Então a resposta deve ter status 400
    E a resposta deve conter a mensagem "Usuário não encontrado"
