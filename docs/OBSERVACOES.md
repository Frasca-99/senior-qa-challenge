# Observações sobre a aplicação

Comportamentos do ServeRest (API e front) encontrados durante a construção da
suíte. Nenhum deles foi contornado nos testes: os cenários afirmam o
comportamento real e este documento registra o que merece atenção do time da
aplicação. Como o ServeRest é um projeto público de estudos, as observações
estão aqui como rastreabilidade, e não como defeitos reportados ao mantenedor.

| ID     | Título                                                          | Severidade | Onde aparece na suíte                         |
| ------ | --------------------------------------------------------------- | ---------- | --------------------------------------------- |
| OBS-01 | API devolve a senha dos usuários em texto puro                  | Alta       | Contrato `usuario` e `lista de usuários`      |
| OBS-02 | Front armazena a senha do usuário no `localStorage`             | Alta       | Armazenamento observado; limpeza verificada no logout |
| OBS-03 | Página do carrinho no front está "Em construção"                | Média      | Limite de cobertura da lista de compras       |
| OBS-04 | Saudação da área administrativa com espaço duplo antes do nome  | Baixa      | `adminHomePage.deveDarBoasVindasA`            |
| OBS-05 | Base pública compartilhada, sem isolamento entre consumidores   | Informativa| Estratégia de massa de dados                  |

## OBS-01 — API devolve a senha dos usuários em texto puro

`GET /usuarios`, `GET /usuarios/{id}` e os filtros por `email` retornam o campo
`password` exatamente como foi cadastrado. O Swagger documenta esse campo na
resposta, então os contratos AJV da suíte o exigem — se a API passar a omitir
a senha (o comportamento correto), o contrato falha e sinaliza a mudança.

## OBS-02 — Front armazena a senha no `localStorage`

Após o login pelo site, o front persiste `serverest/userToken`,
`serverest/userEmail` e também `serverest/userPassword`. O token já é
suficiente para a sessão; guardar a senha no navegador é desnecessário e
expõe a credencial a qualquer script na origem. A função `autenticarPelaApi`,
em `cypress/support/massa_de_dados.js`, prepara a sessão apenas com token e
e-mail. O cenário de logout verifica a remoção das três chaves conhecidas,
incluindo a senha; ele não valida a segurança do armazenamento durante o login.

## OBS-03 — Página do carrinho no front está "Em construção"

O botão "Adicionar no carrinho" da lista de compras leva a `/carrinho`, que
exibe apenas "Em construção aguarde". A lista de compras (`/minhaListaDeProdutos`)
é mantida no `localStorage` do navegador e não chama a API de carrinhos. Por
isso o fluxo de carrinho é coberto pela API (`carrinhos.feature`) e o front é
coberto até a lista de compras.

## OBS-04 — Saudação com espaço duplo

`/admin/home` renderiza `Bem Vindo  <nome>` (dois espaços). A asserção normaliza
os espaços para validar o conteúdo da saudação sem depender desse detalhe de
formatação, e o detalhe fica registrado aqui.

## OBS-05 — Base pública compartilhada

Qualquer pessoa cria, altera e exclui registros no ServeRest público, e a base
é reiniciada periodicamente. Consequências para a suíte:

- nenhum cenário depende de dados pré-existentes (usuários ou produtos
  "conhecidos"); toda massa é criada pela API no próprio cenário;
- e-mails e nomes de produto recebem sufixos únicos por execução;
- a massa criada é registrada para limpeza ao final do cenário, em ordem
  inversa: carrinho, produto, usuário. Os status e as mensagens das exclusões
  são verificados, e consultas confirmam a ausência dos registros;
- o `After` do Cucumber faz a limpeza dos cenários que chegam ao final. Como
  esse hook é pulado quando um passo falha, o `afterEach` do Cypress executa
  a limpeza pendente sem alterar o resultado reprovado;
- falhas na própria limpeza reprovam a execução e podem interromper as
  exclusões seguintes. Se ocorrerem no `afterEach`, a feature pode ser omitida
  dos relatórios Cucumber; o log e o código de saída do Cypress registram a
  falha. Interromper o processo abruptamente também pode impedir a limpeza.
