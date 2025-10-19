// Código cliente para buscar o JSON do quadro a partir do proxy e renderizar no dashboard.
// Inclua <script src="scripts/client-fetch.js"></script> em index.html ou importe via bundler.

async function fetchBoard(boardId, options = {}) {
  if (!boardId) throw new Error('boardId é necessário');
  const proxyBase = options.proxyBase || '/api/board';
  const proxyUrl = `${proxyBase}?boardId=${encodeURIComponent(boardId)}`;
  const res = await fetch(proxyUrl);
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Erro ao buscar board: ${res.status} ${txt}`);
  }
  return res.json();
}

function renderBoard(boardData, container = document.getElementById('dashboard')) {
  container.innerHTML = ''; // limpa

  if (!boardData || !boardData.lists) {
    container.textContent = 'Quadro inválido ou sem listas.';
    return;
  }

  const cardsByList = (boardData.cards || []).reduce((acc, card) => {
    acc[card.idList] = acc[card.idList] || [];
    acc[card.idList].push(card);
    return acc;
  }, {});

  const boardHeader = document.createElement('h2');
  boardHeader.textContent = boardData.name || 'Quadro';
  container.appendChild(boardHeader);

  const listsWrapper = document.createElement('div');
  listsWrapper.className = 'lists-wrapper';
  container.appendChild(listsWrapper);

  boardData.lists.forEach(list => {
    const col = document.createElement('section');
    col.className = 'board-list';
    col.setAttribute('aria-label', `Lista ${list.name}`);

    const title = document.createElement('h3');
    title.textContent = `${list.name} (${(cardsByList[list.id] || []).length})`;
    col.appendChild(title);

    const ul = document.createElement('ul');
    ul.className = 'cards';
    const cards = cardsByList[list.id] || [];
    cards.forEach(card => {
      const li = document.createElement('li');
      li.className = 'card';

      const a = document.createElement('a');
      a.href = card.shortUrl || '#';
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.textContent = card.name || '(sem título)';
      li.appendChild(a);

      if (card.desc) {
        const p = document.createElement('p');
        p.className = 'desc';
        p.textContent = card.desc;
        li.appendChild(p);
      }

      ul.appendChild(li);
    });

    col.appendChild(ul);
    listsWrapper.appendChild(col);
  });
}

async function initDashboard(opts = {}) {
  try {
    const container = document.getElementById('dashboard');
    if (!container) {
      console.warn('Elemento #dashboard não encontrado.');
      return;
    }

    let boardId = container.dataset.boardId || null;
    if (!boardId) {
      const params = new URLSearchParams(window.location.search);
      boardId = params.get('boardId');
    }
    if (!boardId) {
      container.textContent = 'Defina o boardId no atributo data-board-id do #dashboard ou em ?boardId=';
      return;
    }

    const board = await fetchBoard(boardId, opts);
    renderBoard(board, container);
  } catch (err) {
    console.error(err);
    const container = document.getElementById('dashboard');
    if (container) container.textContent = 'Erro ao carregar o quadro. Veja console para detalhes.';
  }
}

window.TW = window.TW || {};
window.TW.fetchBoard = fetchBoard;
window.TW.renderBoard = renderBoard;
window.TW.initDashboard = initDashboard;
