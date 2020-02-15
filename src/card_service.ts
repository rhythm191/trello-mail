// カード系のProxyサービス
import { Baord } from './board';
import { CardList } from './card';

// リストのデータからCardListを生成する
interface CardData {
  idList: string;
  name: string;
}
interface ListData {
  id: string;
  name: string;
}

interface Data {
  lists: ListData[];
  cards: CardData[];
}

const CardService = {
  getSendAddress: async (userName: string): Promise<string> => {
    const response = await fetch(`/1/members/${userName}?fields=email`, {
      credentials: 'include'
    });
    const data = await response.json();
    return data.email;
  },

  getBoardLists: async (boardId: string): Promise<Baord> => {
    const response = await fetch(
      `/1/boards/${boardId}?lists=open&cards=open&card_fields=name,idList&fields=name`,
      { credentials: 'include' }
    );
    const data = await response.json();
    return {
      name: data.name,
      lists: CardService.listDataToCardLists(data)
    };
  },

  // リストのResponseデータからカードリストを作成する
  listDataToCardLists: (data: Data): CardList[] => {
    return data.lists.map(list => {
      const cards = data.cards
        .filter(card => card.idList === list.id)
        .map(card => ({
          name: card.name
        }));

      return {
        id: list.id,
        name: list.name,
        cards: cards
      };
    });
  }
};

export default CardService;
