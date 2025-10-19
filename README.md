# Projetos-Wittel

Dashboard automatizado para visualizar projetos do Trello.

## Objetivo
Conectar na API do Trello, obter o JSON de um quadro e exibir as informações em um dashboard HTML de forma segura.

## Como funciona (visão geral)
1. Um pequeno proxy/backend (ex.: função serverless ou Express) usa TRELLO_KEY e TRELLO_TOKEN guardados no servidor para buscar o JSON do Trello.
2. O frontend (index.html + scripts/client-fetch.js) solicita esse proxy e renderiza listas e cartões no dashboard.
3. As credenciais NÃO são expostas no cliente.

## Arquivos adicionados nesta proposta
- `.env.example` : exemplo de variáveis de ambiente.
- `scripts/proxy-getBoard.js` : pequeno proxy Express para consultar a API do Trello com segurança.
- `scripts/client-fetch.js` : lógica cliente para requisitar o proxy e renderizar o dashboard.
- `.gitignore` : atualizar para ignorar .env, node_modules, etc.
- README atualizado com instruções básicas.

## Rodando localmente (exemplo com Node)
1. Crie um arquivo `.env` baseado em `.env.example` com suas credenciais (NÃO comite o .env).
2. Instale dependências:
   ```bash
   npm install express node-fetch
   ```
3. Inicie o proxy:
   ```bash
   node scripts/proxy-getBoard.js
   ```
4. Abra o `index.html` (ou sirva-o via um servidor estático). Configure a URL do proxy no `scripts/client-fetch.js` se necessário.
5. No `index.html`, adicione um container:
   ```html
   <div id="dashboard" data-board-id="SEU_BOARD_ID"></div>
   <script src="scripts/client-fetch.js"></script>
   <script>TW.initDashboard();</script>
   ```

## Segurança
- Nunca coloque `TRELLO_KEY` e `TRELLO_TOKEN` diretamente no JavaScript cliente.
- Use um backend ou função serverless para esconder as credenciais.

## Próximos passos sugeridos
- Fazer deploy do proxy como função serverless (Vercel/Netlify/AWS Lambda).
- Adicionar lint (ESLint) e CI (GitHub Actions).
- Mover CSS/JS adicionais para pastas `styles/` e `scripts/` (se ainda não).
- Adicionar LICENSE e CONTRIBUTING.md.
