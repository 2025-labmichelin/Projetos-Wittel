const fs = require('fs');
const fetch = require('node-fetch');

// Configurações do Trello
const TRELLO_API_KEY = process.env.TRELLO_API_KEY;
const TRELLO_TOKEN = process.env.TRELLO_TOKEN;
const BOARD_ID = process.env.TRELLO_BOARD_ID;

async function fetchTrelloData() {
  try {
    console.log('🔄 Buscando dados do Trello...');

    // Buscar informações do board
    const boardUrl = `https://api.trello.com/1/boards/${BOARD_ID}?key=${TRELLO_API_KEY}&token=${TRELLO_TOKEN}`;
    const boardResponse = await fetch(boardUrl);
    const board = await boardResponse.json();

    // Buscar listas
    const listsUrl = `https://api.trello.com/1/boards/${BOARD_ID}/lists?key=${TRELLO_API_KEY}&token=${TRELLO_TOKEN}`;
    const listsResponse = await fetch(listsUrl);
    const lists = await listsResponse.json();

    // Buscar cards
    const cardsUrl = `https://api.trello.com/1/boards/${BOARD_ID}/cards?key=${TRELLO_API_KEY}&token=${TRELLO_TOKEN}`;
    const cardsResponse = await fetch(cardsUrl);
    const cards = await cardsResponse.json();

    // Processar dados
    const processedCards = cards.map(card => ({
      id: card.id,
      name: card.name,
      desc: card.desc,
      idList: card.idList,
      labels: card.labels,
      due: card.due,
      dueComplete: card.dueComplete,
      url: card.url,
      members: card.idMembers
    }));

    const processedLists = lists.map(list => ({
      id: list.id,
      name: list.name,
      closed: list.closed
    }));

    // Estrutura final
    const data = {
      board: {
        id: board.id,
        name: board.name,
        url: board.url
      },
      lists: processedLists,
      cards: processedCards,
      last_update: new Date().toISOString(),
      total_cards: processedCards.length,
      total_lists: processedLists.length
    };

    // Salvar no arquivo JSON
    fs.writeFileSync('./data/trello-data.json', JSON.stringify(data, null, 2));
    console.log('✅ Dados atualizados com sucesso!');
    console.log(`📊 Total de cards: ${processedCards.length}`);
    console.log(`📋 Total de listas: ${processedLists.length}`);

  } catch (error) {
    console.error('❌ Erro ao buscar dados do Trello:', error.message);
    process.exit(1);
  }
}

fetchTrelloData();
