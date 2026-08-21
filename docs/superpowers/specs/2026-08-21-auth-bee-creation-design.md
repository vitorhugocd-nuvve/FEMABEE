# Auth + Seleção/Criação de Abelha — Design

Data: 2026-08-21

## Contexto

O app hoje é 100% mock (`core/seeds`), sem `HttpClient` provido em lugar nenhum. Existe um backend real em `../new-back` (NestJS + TypeORM/Postgres + JWT) com três módulos: `Usuario` (conta/login), `Jogador` (perfil do jogador + suas abelhas) e `Abelha` (progresso de cada run). Esta spec cobre a primeira integração HTTP real do projeto: cadastro de conta, login, e a tela de seleção/criação de abelha (cada abelha = uma "run", máximo 3 por jogador).

Fora de escopo: reescrever `MapaAtualService`/economia do jogo pra usar dados reais da abelha selecionada (dinheiro, tickets, mapa atual) — isso continua mockado por enquanto. Também fora de escopo: reconciliar o guarda-roupa (hoje local/mock) com o inventário de roupas do backend, e exclusão de abelha na tela de seleção.

## Contrato do backend (referência)

Base: `http://localhost:3000/api` (CORS precisa liberar `http://localhost:4200` — nota operacional, fora do código do front). Toda resposta vem em `{ sucesso, mensagem, status, dados }`, sucesso ou erro.

- `POST /autenticacao` — cadastro: `{ nomeDeUsuario, email, senha }`. Público. Senha forte (8+ chars, maiúscula/minúscula/número/símbolo).
- `POST /autenticacao/login` — `{ email, senha }` → `dados: { token }` (JWT, expira em 1h por padrão). Público.
- `GET /autenticacao/perfil` — autenticado.
- `POST /jogador` — `{ nome, comidaFavorita, abelha: { nome, tamanho? } }` → cria Jogador + primeira Abelha juntos. 409 se o usuário já tem jogador.
- `GET /jogador/perfil` — jogador logado + `abelhas[]`. 404 se ainda não existe jogador.
- `POST /jogador/abelhas` — `{ nome, tamanho? }` → cria abelha adicional. 400 se já tem 3.
- `DELETE /jogador/abelhas/:id` — não usado nesta spec.

Autenticação: `Authorization: Bearer <token>` em toda rota exceto as marcadas públicas. Sem refresh/logout no backend — é stateless; expirar o token = 401.

## Fluxo de telas

```
/cadastro ──► /login ──► /abelhas (3 slots) ──► mapa (jogo)
                              │  clique em slot vazio
                              ▼
                      form "criar abelha"
```

### `/cadastro` e `/login`
Públicas. O stub em `src/app/login/login.component.ts` (campo "Nome") vira campo **email**, ligado ao `AuthService`. Cadastro é tela nova reaproveitando os mesmos primitivos de UI (`bee-field`, `bee-input`, `bee-label`, `bee-button`).

### `/abelhas` (seleção)
Protegida por `authGuard`. Ao entrar, chama `GET /jogador/perfil`:
- 404 → 0 abelhas, os 3 slots (esquerda/centro/direita) aparecem vazios com "+" gigante.
- 200 → mapeia `abelhas[]` pros slots na ordem retornada; slots sem abelha correspondente ficam vazios com "+".

Slot preenchido: renderiza `bee-abelha` (tamanho da abelha, sem aparências equipadas — visual base) + nome. Clique seleciona essa abelha como ativa (`AbelhaAtivaService`) e navega pro mapa.

Slot vazio ("+"): clique abre o form de criação.

### Form "criar abelha"
Campos sempre: nome da abelha (obrigatório), tamanho (seletor reaproveitando o grid de `TamanhoAbelha` que já existe no guarda-roupa). **Sem customização de roupa** — decisão confirmada: o formato de `roupa` do backend (objeto único com 6 caminhos de imagem) não bate com o sistema de aparência por slot do front, e reconciliar isso fica pra depois.

Se `GET /jogador/perfil` deu 404 antes (jogador ainda não existe): campos extras "nome do jogador" + "comida favorita", e o submit chama `POST /jogador`. Caso contrário, submit chama `POST /jogador/abelhas`. Depois do sucesso, recarrega a lista e volta pra `/abelhas` com o novo slot preenchido.

## Infraestrutura nova

- `provideHttpClient(withInterceptors([authInterceptor]))` em `app.config.ts`.
- `src/app/core/constants/api.ts` — `API_BASE_URL` (sem sistema de environment do Angular, é YAGNI pra este tamanho de projeto).
- `src/app/core/auth/auth.service.ts` — `providedIn: 'root'`. `cadastrar()`, `login()`, `logout()`, signal `token`/`usuarioLogado`. Token persistido em `localStorage`.
- `src/app/core/auth/auth.interceptor.ts` — anexa `Authorization: Bearer` quando há token; em 401, chama `logout()` e redireciona pra `/login`.
- `src/app/core/auth/auth.guard.ts` — `CanActivateFn`, redireciona pra `/login` se não há token.
- `src/app/core/jogador/jogador.service.ts` — `buscarPerfil()` (trata 404 como "sem jogador"), `criarJogador()`, `criarAbelha()`. Segue o padrão `_signal`/`readonly signal` já usado no resto do projeto.
- `src/app/core/jogador/abelha-ativa.service.ts` — signal só em memória com o id da abelha escolhida (reload volta pra `/abelhas`, não persiste — evita estado obsoleto).
- Modelos de domínio novos em `src/app/core/models/jogador/` e `.../abelha/` seguindo o padrão `*Props` + classe com getters já usado em `Mapa`/`Desafio`.
- `App` (`app.ts`) passa a usar `<router-outlet />` como mecanismo real de navegação em vez de renderizar `<app-map />` fixo — hoje o roteador existe mas não está plugado (nota do CLAUDE.md), essa spec é o que liga ele.
- Erros do backend (`mensagem` do envelope) aparecem via `bee-indicator` (toast), que já é o padrão de feedback do projeto — sem componente novo de erro.

## Testes

Não existem testes no projeto ainda (Vitest está configurado, mas sem specs). A pedido do usuário, esta spec inclui uma pasta de testes de **integração** contra o backend real (não mocks): `src/app/core/auth/auth.integration.spec.ts` e `src/app/core/jogador/jogador.integration.spec.ts` (ou uma pasta dedicada `src/test/integration/` se ficar mais limpo separar do resto). Cada teste sobe contra `http://localhost:3000/api` de verdade — backend precisa estar rodando com banco disponível. Para evitar colisão de dados entre execuções, cada teste gera um email/nome de usuário único (timestamp/uuid) ao invés de fixture fixa. Cobertura mínima:

- Cadastro com dados válidos → sucesso; cadastro com email duplicado → 409.
- Login com credenciais corretas → token; senha errada → 401.
- `GET /jogador/perfil` sem jogador ainda → 404 tratado como "sem jogador".
- `POST /jogador` cria jogador + 1ª abelha; chamar de novo → 409.
- `POST /jogador/abelhas` até o limite de 3; a 4ª → 400.

Esses testes não rodam em CI sem o backend de pé — ficam documentados como testes de integração manuais/local, não substituem verificação automática de build.

## Riscos / pontos em aberto

- CORS do backend precisa liberar a origem do Angular dev (`http://localhost:4200`) — hoje o default é `localhost:3001`. Ajuste de configuração do backend, não deste front.
- Sem refresh token: sessão expira em 1h e o usuário é jogado de volta pro login sem aviso prévio — aceitável para este escopo.
