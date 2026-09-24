# language: pt
@web @regression
Funcionalidade: Login na loja
  Como usuário cadastrado
  Quero me autenticar pelo site
  Para acessar a área correspondente ao meu perfil

  Contexto:
    Dado que estou na página de login

  @smoke
  Cenário: Autenticar como administrador
    Dado que existe um administrador cadastrado
    Quando informo as credenciais desse administrador e entro
    Então devo ser direcionado para a área administrativa
    E a área administrativa deve dar boas-vindas ao administrador pelo nome

  Cenário: Autenticar como usuário comum
    Dado que existe um usuário cadastrado
    E que existe um administrador autenticado
    E que existe um produto cadastrado
    Quando informo as credenciais desse usuário e entro
    Então devo ser direcionado para a loja
    E a loja deve exibir a vitrine de produtos

  Cenário: Recusar senha incorreta
    Dado que existe um usuário cadastrado
    Quando informo o e-mail desse usuário com uma senha incorreta e entro
    Então devo ver o alerta "Email e/ou senha inválidos"
    E devo permanecer na página de login

  Cenário: Recusar e-mail não cadastrado
    Quando informo um e-mail não cadastrado e entro
    Então devo ver o alerta "Email e/ou senha inválidos"
    E devo permanecer na página de login

  Cenário: Recusar login sem preencher os campos
    Quando entro sem preencher nenhum campo
    Então devo ver os alertas:
      | Email é obrigatório    |
      | Password é obrigatório |
    E devo permanecer na página de login

  Cenário: Encerrar a sessão
    Dado que existe um usuário cadastrado
    E que informo as credenciais desse usuário e entro
    Quando encerro a sessão
    Então devo ser direcionado para a página de login
    E a sessão não deve mais estar armazenada no navegador
