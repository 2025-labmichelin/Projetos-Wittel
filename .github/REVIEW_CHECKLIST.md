# Checklist de revisão antes do merge

Use esta checklist ao revisar o Pull Request antes de aprovar/mergear. Marque cada item conforme for verificado.

## Segurança
- [ ] Verificar que NÃO existem chaves, tokens ou credenciais no PR (git grep por "key|token|TRELLO|API_KEY|SECRET").
- [ ] Confirmar que `.env` está em `.gitignore` e que não há arquivos `.env` commitados.
- [ ] Confirmar que qualquer comunicação com a API do Trello usa proxy/backend (não expor key/token no cliente).

## Funcionalidade
- [ ] O proxy (`scripts/proxy-getBoard.js`) responde corretamente a `GET /api/board?boardId=<ID>` localmente.
- [ ] O cliente (`scripts/client-fetch.js`) recupera os dados do proxy e renderiza listas e cartões sem erros.
- [ ] Testar com um `boardId` real (em ambiente local só) e verificar que os dados exibidos condizem com o quadro Trello.

## Código e organização
- [ ] JavaScript e CSS extraídos do `index.html` e colocados em `scripts/` e `styles/` quando aplicável.
- [ ] Estrutura de pastas está coerente e clara para manutenção (scripts/, data/, styles/).
- [ ] Código legível, com comentários onde necessário e sem duplicação óbvia.

## Dependências e build
- [ ] `package.json` contém scripts úteis (ex.: "start", "test", "lint").
- [ ] Existe lockfile (`package-lock.json` ou `yarn.lock`) committado para travar versões.
- [ ] Dependências instaladas localmente e validadas (npm install produz o lockfile esperado).

## Testes e qualidade
- [ ] Linter configurado e sem erros bloqueadores (sugerido: ESLint para JS).
- [ ] Não há erros no console do browser ao carregar o dashboard.
- [ ] Fluxo happy path testado manualmente (carregar board com cartões, abrir links dos cartões).

## Acessibilidade e UX
- [ ] Elementos interativos têm atributos ARIA e labels quando apropriado.
- [ ] Contraste e legibilidade básicos verificados (títulos, cartões, botões).
- [ ] Navegação por teclado possível (tab order razoável).

## Segurança de CORS e deployment
- [ ] Proxy define `Access-Control-Allow-Origin` de forma apropriada (não wildcard em produção).
- [ ] Variáveis de ambiente (TRELLO_KEY, TRELLO_TOKEN) configuradas no ambiente de deploy (Vercel/Netlify/AWS) e NÃO committadas.

## Documentação
- [ ] README atualizado com instruções de execução local, deploy e segurança.
- [ ] `.env.example` presente e contém todas as variáveis necessárias.
- [ ] LICENSE presente (ou plano para adicionar) — confirmar política de licença do projeto.

## CI / PR
- [ ] CI (se presente) está verde (lint/build/tests passing) — ou PR descreve que CI será adicionado posteriormente.
- [ ] PR tem descrição clara e lista de alterações / arquivos afetados.
- [ ] Mudanças pequenas e atômicas — ou o PR está bem justificado se for grande.
- [ ] Alguém além do autor aprovou e revisou o PR (revisores adicionados).

## Operacional
- [ ] Instruções de deploy atualizadas (ou checklist de deploy documentado).
- [ ] Rollback/undo fácil em caso de problemas (ex.: tag ou histórico de commits claro).

## Pós-merge
- [ ] Atualizar documentação pública (GitHub Pages) se aplicável.
- [ ] Remover tokens temporários / rotacionar credenciais se foram usadas em testes.

---

Comandos úteis para revisão local rápida:

```bash
# trocar para a branch do PR
git fetch origin
git checkout add-proxy-and-client

# instalar dependências
npm install

# rodar o proxy localmente
node scripts/proxy-getBoard.js

# abrir index.html via servidor estático (ex: Python)
python -m http.server 8000
# ou usando serve
npx serve .
```

Observação: testar com um `.env` local (não commitado) contendo suas TRELLO_KEY e TRELLO_TOKEN.