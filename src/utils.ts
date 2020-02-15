import { CardList } from './card';

// リストからテキストを生成する
export function listToString(list: CardList): string {
  let result = '';

  result += `${list.name}\n`;
  result += `${new Array(list.name.length * 2).join('-')}\n`;
  result += `\n`;
  if (list.cards.length > 0) {
    result += list.cards.map(card => `* ${card.name}`).join('\n');
    result += `\n`;
  }

  return result;
}

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

// リストのResponseデータからカードリストを作成する
export function listDataToCardLists(data: Data): CardList[] {
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

// メールの文字列をエスケープする
export function escapeMailText(str: string): string {
  return str
    .replace(/%/g, '%25')
    .replace(/\n/g, '%0d%0a')
    .replace(/=/g, '%3D')
    .replace(/&/g, '%26')
    .replace(/,/g, '%2C')
    .replace(/ /g, '%20')
    .replace(/\?/g, '%3f');
}
