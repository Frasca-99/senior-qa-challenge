# Observações sobre a aplicação

Comportamentos do ServeRest (API e front) encontrados durante a construção da
suíte e a exploração complementar. Este índice registra o que merece atenção
na avaliação técnica e na triagem pelo time da aplicação, com referência à
suíte ou ao relato exploratório. Os achados complementares não aumentam a
contagem dos 48 cenários automatizados.

Nenhum desses comportamentos foi contornado nos testes. Como o ServeRest é um
projeto público de estudos, as observações registram a rastreabilidade dos
achados; não houve reporte ao mantenedor. As severidades são sugestões para
triagem. As evidências e os passos de reprodução da exploração estão no
[relatório complementar](EXPLORACAO.md).

| ID     | Título                                                          | Severidade | Relação com a suíte ou exploração                         |
| ------ | --------------------------------------------------------------- | ---------- | --------------------------------------------- |
| OBS-01 | API devolve a senha dos usuários em texto puro                  | Alta       | Contrato `usuario` e `lista de usuários`      |
| OBS-02 | Front armazena a senha do usuário no `localStorage`             | Alta       | Armazenamento observado; limpeza verificada no logout |
| OBS-03 | Página do carrinho no front está "Em construção"                | Informativa | Limite de cobertura da lista de compras       |
| OBS-04 | Saudação da área administrativa com espaço duplo antes do nome  | Baixa      | `adminHomePage.deveDarBoasVindasA`            |
| OBS-05 | Base pública compartilhada, sem isolamento entre consumidores   | Informativa| Estratégia de massa de dados                  |
| OBS-06 | Menu não expande em janela de 464 px | Média | Exploração do front; sem cenário automatizado específico |

## OBS-01 — API devolve a senha dos usuários em texto puro

`GET /usuarios`, `GET /usuarios/{id}` e os filtros por `email` retornam o campo
`password` exatamente como foi cadastrado. O Swagger documenta esse campo na
resposta, então os contratos AJV da suíte o exigem — se a API passar a omitir
a senha (o comportamento correto), o contrato falha e sinaliza a mudança.

## OBS-02 — Front armazena a senha no `localStorage`

Após o **cadastro pelo site**, o front grava `serverest/userEmail` e
`serverest/userPassword` e autentica o usuário. A exploração em uma sessão
inicialmente vazia confirmou que a senha armazenada é igual à informada no
cadastro. O fluxo de login grava e-mail e token; não se deve atribuir a ele
uma senha que possa ter permanecido de um cadastro anterior.

Guardar a senha no navegador expõe a credencial aos scripts da origem.
A função `autenticarPelaApi`, em `cypress/support/massa_de_dados.js`, prepara
a sessão apenas com token e e-mail. O cenário de logout verifica a remoção
das três chaves conhecidas, incluindo a senha; ele não valida a segurança do
armazenamento. A exploração confirmou a remoção dessas chaves no logout.
Os passos e a evidência sem credenciais estão em
[EXPLORACAO.md](EXPLORACAO.md#obs-02--senha-persistida-no-cadastro).

## OBS-03 — Página do carrinho no front está "Em construção"

O botão "Adicionar no carrinho" da lista de compras leva a `/carrinho`, que
exibe apenas "Em construção aguarde". A lista de compras (`/minhaListaDeProdutos`)
é mantida no `localStorage` do navegador e não chama a API de carrinhos. Por
isso o fluxo de carrinho é coberto pela API (`carrinhos.feature`) e o front é
coberto até a lista de compras. Trata-se de uma limitação anunciada pela
aplicação, sem pressupor um requisito de checkout não fornecido.
A [exploração do front](EXPLORACAO.md#obs-03--carrinho-em-construção)
registra os passos e a captura da tela.

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

## OBS-06 — Menu não expande em janela estreita

Em viewport de 464 × 760 px, clicar em “Toggle navigation” não abre o menu
em `/home` e `/carrinho`; `aria-expanded` permanece `false`. Em `/home`,
os links e o logout continuam ocultos. Em 1280 × 800 px, os controles estão
visíveis e o logout funciona. A severidade média é sugerida pelo bloqueio da
navegação pelo menu na largura verificada; outras larguras e navegadores
não foram abrangidos.

A [exploração do front](EXPLORACAO.md#obs-06--menu-não-expande-em-janela-estreita)
contém os passos, as capturas antes/depois e a comparação com desktop. Este
achado não está coberto por um cenário automatizado específico.
