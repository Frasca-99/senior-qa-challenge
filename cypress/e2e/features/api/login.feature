# language: pt
@api @regression
Funcionalidade: Autenticação pela API
  Como consumidor da API do ServeRest
  Quero autenticar um usuário cadastrado
  Para obter o token que dá acesso às rotas protegidas

  @smoke
  Cenário: Autenticar com credenciais válidas
    Dado que existe um usuário cadastrado
    Quando faço login via API com as credenciais desse usuário
    Então a resposta deve ter status 200
    E a resposta deve respeitar o contrato de "login com sucesso"
    E o token retornado deve dar acesso a uma rota protegida

  Cenário: Recusar login com senha incorreta
    Dado que existe um usuário cadastrado
    Quando faço login via API com a senha incorreta
    Então a resposta deve ter status 401
    E a resposta deve conter a mensagem "Email e/ou senha inválidos"
    E a resposta deve respeitar o contrato de "mensagem"

  Cenário: Recusar login de e-mail não cadastrado
    Quando faço login via API com um e-mail não cadastrado
    Então a resposta deve ter status 401
    E a resposta deve conter a mensagem "Email e/ou senha inválidos"

  Cenário: Recusar login sem informar as credenciais
    Quando faço login via API sem informar e-mail nem senha
    Então a resposta deve ter status 400
    E a resposta deve apontar como obrigatórios os campos:
      | email    |
      | password |

  Cenário: Recusar acesso a rota protegida com token inválido
    Quando tento cadastrar um produto com um token inválido
    Então a resposta deve ter status 401
    E a resposta deve conter a mensagem "Token de acesso ausente, inválido, expirado ou usuário do token não existe mais"
