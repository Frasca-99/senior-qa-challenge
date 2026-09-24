# ServeRest — Suíte de automação (Cypress + Cucumber)

Suíte de testes automatizados **E2E (front)** e **API** para o
[ServeRest](https://serverest.dev), construída com **Cypress + Cucumber (BDD)**
em JavaScript, como resposta ao teste técnico de Senior QA Tester.

- Front sob teste: https://front.serverest.dev/
- API sob teste (Swagger): https://serverest.dev/

A suíte contém **48 cenários BDD** (33 de API e 15 E2E), em **7 features**
(4 de API e 3 E2E), com cenários positivos e negativos em cada uma. Os testes
exercitam a aplicação pública real, sem mocks e sem repetição de cenários
reprovados. A limpeza da massa é executada ao final de cada cenário e valida
as respostas da API.

## Pré-requisitos

- [Node.js](https://nodejs.org/en/) 24 (inclui o npm). `.nvmrc` seleciona essa
  versão principal, usada nos três jobs do CI. Se utiliza nvm, execute
  `nvm install` e `nvm use` antes de instalar as dependências.
- [Git](https://git-scm.com/downloads).

A suíte não exige credenciais pessoais, secrets ou arquivo `.env`. As
credenciais temporárias são geradas pelos testes; usuários, produtos e
carrinhos próprios são registrados para limpeza ao final do cenário.

## Instalação e execução

```bash
git clone https://github.com/Frasca-99/serverest-cypress.git
cd serverest-cypress
npm ci
npm run lint
npm test
```

| Comando              | Escopo                                             |
| -------------------- | -------------------------------------------------- |
| `npm test`           | Toda a suíte em modo headless                      |
| `npm run test:open`  | Cypress interativo                                 |
| `npm run test:api`   | Apenas os cenários de API (`@api`)                 |
| `npm run test:web`   | Apenas os cenários E2E do front (`@web`)           |
| `npm run test:smoke` | Subconjunto rápido de fumaça (`@smoke`, 7 cenários)|
| `npm run lint`       | ESLint com zero avisos                             |
| `npm audit --audit-level=high` | Auditoria de vulnerabilidades altas e críticas |

Relatórios de execução (HTML, JSON e messages do Cucumber) são gerados em
`cypress/reports/` — ignorados pelo Git e publicados como artifact no CI.
Screenshots de falha ficam em `cypress/screenshots/`.

Os filtros por tag usam a opção `--expose tags=...` do Cypress
(`cypress run --expose tags="@api and not @smoke"`, por exemplo).

## Validação local

Resultados registrados em **24/09/2026**, após a correção da limpeza após
falhas, com Node.js 24.21.0, npm 11.19.0, Cypress 15.21.1 e Electron 138 em
modo headless no macOS:

| Verificação | Resultado | Duração do comando |
| --- | --- | --- |
| `npm ci` em cópia limpa | Instalação concluída | 2,09 s |
| `npm run lint` | Sem erros ou avisos, inclusive na cópia limpa | — |
| `npm audit --audit-level=high` | Zero vulnerabilidades reportadas | — |
| `npm test` | 48 aprovados; nenhuma falha ou caso ignorado | 103,19 s |
| `npm run test:smoke` após instalação limpa | 7 aprovados; nenhuma falha ou caso ignorado | 30,77 s |

O `npm ci` emitiu avisos sobre a dependência transitiva `glob` e a política
de scripts do npm, sem impedir a instalação ou a execução posterior.

Um diagnóstico temporário, separado dos 48 cenários entregues, provocou duas
falhas: uma após criar carrinho, produto e usuários; outra após cadastrar um
usuário registrado para limpeza por e-mail. As duas falhas permaneceram
reprovadas no Cypress e no relatório Cucumber (código de saída 2). Os dois
cenários seguintes passaram ao consultar a API e confirmar a ausência de
todos esses registros. O diagnóstico e suas evidências foram preservados
localmente fora do repositório.

Após a regressão e o smoke, consultas à API encontraram zero usuários com
`serverest-tests.com.br` no e-mail e zero produtos com o sufixo de timestamp
e identificador usado pela factory. Esses resultados retratam as execuções
registradas; a aplicação e a base pública podem mudar posteriormente.

Os relatórios em `cypress/reports/` correspondem à última execução e são
substituídos a cada nova rodada. A validação acima foi local; a execução do
workflow no GitHub Actions ainda depende da publicação do repositório.

Se a própria limpeza no `afterEach` falhar, o preprocessor pode omitir a
feature afetada dos relatórios Cucumber. Nessa situação, o log e o código de
saída do Cypress registram a falha e devem ser consultados.

## Cobertura

### E2E — front (`cypress/e2e/features/web/`)

| Feature                          | Cenários | Positivos                                                                        | Negativos                                                                  |
| -------------------------------- | -------- | -------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| `login.feature`                  | 6        | Login de administrador (área administrativa, saudação pelo nome); login de usuário comum (loja); logout limpa a sessão | Senha incorreta; e-mail não cadastrado; campos vazios                      |
| `cadastro_usuario.feature`       | 4        | Cadastro de usuário comum e de administrador pelo site, com verificação do registro na API | E-mail já cadastrado; campos vazios                                        |
| `vitrine_lista_compras.feature`  | 5        | Busca por nome; adicionar à lista de compras; aumentar/diminuir quantidade; limpar lista | Busca por produto inexistente                                              |

### API (`cypress/e2e/features/api/`)

| Feature              | Cenários | Positivos                                                                                   | Negativos                                                                                                     |
| -------------------- | -------- | ------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `usuarios.feature`   | 10       | Cadastrar (com consulta por id e contrato); editar nome/senha e validar autenticação; excluir                                 | E-mail duplicado; campo inválido (4 exemplos); nenhum campo; id inexistente                                   |
| `login.feature`      | 5        | Autenticar (contrato do token e uso do token em rota protegida)                             | Senha incorreta; e-mail não cadastrado; credenciais ausentes; token inválido em rota protegida                |
| `produtos.feature`   | 10       | Cadastrar como administrador (com consulta e contrato); listar filtrando por nome; excluir  | Sem token (401); usuário comum (403); nome duplicado; campo inválido (4 exemplos)                             |
| `carrinhos.feature`  | 8        | Criar carrinho (totais e baixa no estoque); cancelar compra (estoque devolvido); concluir compra; cancelar sem carrinho | Segundo carrinho; quantidade acima do estoque; produto inexistente; sem token                                 |

Todas as respostas de sucesso e de erro têm o status HTTP afirmado
explicitamente; as respostas principais são validadas contra contratos
JSON Schema (AJV) derivados do Swagger.

## Estrutura da automação

```
cypress/
  e2e/features/
    api/                  # Features de API (Gherkin em português)
    web/                  # Features E2E do front
  support/
    api/                  # Camada de serviço da API (um módulo por recurso)
    contracts/            # Contratos JSON Schema (AJV) das respostas
    factories/            # Massa de dados dinâmica (faker, pt_BR)
    pages/                # Page objects do front + componente de alertas
    step_definitions/     # Steps organizados por funcionalidade + hooks
    cleanup.js            # Registro de limpeza por cenário (LIFO)
    massa_de_dados.js     # Pré-condições: cria dados pela API e agenda a limpeza
docs/
  OBSERVACOES.md          # Comportamentos da aplicação que merecem atenção
.github/workflows/ci.yml  # Lint, auditoria, smoke em PR e regressão na main
```

## Decisões técnicas

- **BDD em português com Cucumber.** As features descrevem o comportamento na
  linguagem do negócio; cada step definition é fina e delega a page objects
  (front) ou à camada de serviço da API.
- **Page objects e camada de serviço.** Seletores e navegação ficam nos page
  objects (`support/pages`), preferindo `data-testid`; cada recurso da API tem
  um módulo (`support/api`) sobre um cliente único que nunca falha por status
  code — cada cenário afirma o status que espera, positivo ou negativo.
- **Massa de dados dinâmica e isolada.** Nenhum cenário depende de dados
  pré-existentes da base pública (que é compartilhada e reiniciada
  periodicamente). Usuários, produtos e carrinhos são criados pela API no
  próprio cenário, com e-mails e nomes únicos. A limpeza respeita a ordem
  inversa (carrinho → produto → usuário), valida status e mensagens de
  exclusão e confirma a ausência por consulta, inclusive quando o próprio
  teste já removeu o registro. O `After` do Cucumber registra a limpeza no
  relatório quando o cenário chega ao final; o `afterEach` do Cypress executa
  a limpeza pendente quando um passo falha, preservando a reprovação. Uma
  falha na própria limpeza reprova a execução e pode interromper as exclusões
  seguintes. Uma interrupção abrupta do processo pode impedir esses hooks.
- **Sessão pela API nos cenários que não testam o login.** Os cenários da
  vitrine autenticam pela API e replicam no navegador o que o front persiste
  (token e e-mail), evitando repetir o fluxo de login e acelerando a suíte.
- **Contratos com AJV.** As respostas são validadas contra schemas estritos
  (`additionalProperties: false`), de modo que campo novo, renomeado ou com
  tipo diferente seja detectado.
- **Sem repetição de cenários e sem esperas fixas.** `retries: 0` mantém
  cenários reprovados como falhas. As consultas ao DOM usam asserções com
  repetição automática do Cypress; `cy.request` mantém o comportamento padrão
  de repetir erros transitórios de rede, sem repetir respostas HTTP de erro.
  Os timeouts acomodam a latência da aplicação remota.
- **`expose` no lugar de `Cypress.env()`.** O Cypress 15.17+ substituiu
  `Cypress.env()` por `Cypress.expose()` para valores públicos; a suíte usa a
  API nova (com `allowCypressEnv: false`) e o filtro de tags via `--expose`.
- **Sem support file.** As pré-condições vivem em `support/massa_de_dados.js` e
  são importadas pelas step definitions: o Cypress empacota support file e spec
  separadamente, e o registro de limpeza precisa ser uma única instância.
- **Auditoria de dependências.** O CI executa `npm audit --audit-level=high`.
  Os `overrides` de `diff` e `serialize-javascript` estão limitados ao `mocha`
  no `package.json`, mantendo a versão do próprio `mocha`. O lockfile registra
  as versões instaladas; novos avisos devem ser avaliados a cada auditoria.
- **Cobertura do carrinho no front.** A página `/carrinho` do front está "Em
  construção", então o fluxo de carrinho é coberto pela API e o front é
  coberto até a lista de compras (ver [docs/OBSERVACOES.md](docs/OBSERVACOES.md)).

## Integração contínua

O workflow ([.github/workflows/ci.yml](.github/workflows/ci.yml)) roda em push
na `main`, em pull requests, semanalmente e sob demanda, sem secrets:

1. **Lint e auditoria** — `npm run lint` (zero avisos) e
   `npm audit --audit-level=high`;
2. **Smoke em pull requests** e **suíte completa na `main`**, contra a
   aplicação pública;
3. Relatórios e screenshots disponíveis publicados como artifacts, mesmo
   quando os testes falham.

O Dependabot propõe atualizações semanais das dependências npm e das actions.

## Observações sobre a aplicação

Comportamentos do ServeRest encontrados durante a automação (senha em texto
puro nas respostas da API, senha persistida no `localStorage` do front, página
do carrinho em construção, entre outros) estão documentados em
[docs/OBSERVACOES.md](docs/OBSERVACOES.md). Nenhum foi contornado nos testes.
