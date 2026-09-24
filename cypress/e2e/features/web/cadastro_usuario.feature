# language: pt
@web @regression
Funcionalidade: Cadastro de usuário pelo site
  Como visitante da loja
  Quero me cadastrar pelo formulário do site
  Para acessar a loja com uma conta própria

  Contexto:
    Dado que estou na página de cadastro

  @smoke
  Cenário: Cadastrar um usuário comum
    Quando preencho o cadastro com os dados de um novo usuário comum
    E confirmo o cadastro
    Então devo ver o alerta "Cadastro realizado com sucesso"
    E devo ser direcionado para a loja
    E o usuário cadastrado deve existir na API como usuário comum

  Cenário: Cadastrar um administrador
    Quando preencho o cadastro com os dados de um novo administrador
    E confirmo o cadastro
    Então devo ver o alerta "Cadastro realizado com sucesso"
    E devo ser direcionado para a área administrativa
    E o usuário cadastrado deve existir na API como administrador

  Cenário: Recusar e-mail já cadastrado
    Dado que existe um usuário cadastrado
    Quando preencho o cadastro reutilizando o e-mail desse usuário
    E confirmo o cadastro
    Então devo ver o alerta "Este email já está sendo usado"
    E devo permanecer na página de cadastro

  Cenário: Recusar cadastro sem preencher os campos
    Quando confirmo o cadastro sem preencher nenhum campo
    Então devo ver os alertas:
      | Nome é obrigatório     |
      | Email é obrigatório    |
      | Password é obrigatório |
    E devo permanecer na página de cadastro
