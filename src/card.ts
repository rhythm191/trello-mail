// カードのタイプ

export type Card = {
  name: string;
};

export type CardList = {
  id: string;
  name: string;
  cards: Card[];
};
