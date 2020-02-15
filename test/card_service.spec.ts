import fetchMock from 'fetch-mock';
import CardService from '../src/card_service';

describe('CardService', () => {
  test('getSendAddress', async () => {
    fetchMock.get('/1/members/test?fields=email', {
      status: 200,
      body: {
        id: '5dd9c9ce4243690dc802030e',
        email: 'test@example.com'
      }
    });

    const name = await CardService.getSendAddress('test');
    expect(name).toBe('test@example.com');
  });

  describe('getBoard', () => {
    fetchMock.get(
      '/1/boards/111?lists=open&cards=open&card_fields=name,idList&fields=name',
      {
        status: 200,
        body: {
          id: '5dd9c9ce4243690dc802030e',
          name: 'test',
          cards: [
            {
              id: '5dd9c9e476594a31891ab5a0',
              name: 'this is test card',
              pos: 65535,
              idList: '5dd9c9d8689d2f1572a5b554'
            }
          ],
          lists: [
            {
              id: '5dd9c9d8689d2f1572a5b554',
              name: 'this is test list',
              closed: false,
              idBoard: '5dd9c9ce4243690dc802030e',
              pos: 65535,
              subscribed: false,
              softLimit: null
            },
            {
              id: '5dd9c9d8689d2f1572a5b552',
              name: 'this is test list2',
              closed: false,
              idBoard: '5dd9c9ce4243690dc8020303',
              pos: 65536,
              subscribed: false,
              softLimit: null
            }
          ]
        }
      }
    );

    test('list name is undefined', async () => {
      const board = await CardService.getBoard('111');
      expect(board.name).toBe('test');
      expect(board.lists.length).toBe(2);
      expect(board.lists[0].name).toBe('this is test list');
      expect(board.lists[0].cards[0].name).toBe('this is test card');
    });

    test('list name is defined', async () => {
      const board = await CardService.getBoard('111', 'this is test list');
      expect(board.name).toBe('test');
      expect(board.lists.length).toBe(1);
      expect(board.lists[0].name).toBe('this is test list');
      expect(board.lists[0].cards[0].name).toBe('this is test card');
    });
  });

  describe('listDataToCardLists', () => {
    const data = {
      id: '5dd9c9ce4243690dc802030e',
      name: 'test',
      cards: [
        {
          id: '5dd9c9e476594a31891ab5a0',
          name: 'this is test card',
          pos: 65535,
          idList: '5dd9c9d8689d2f1572a5b554'
        }
      ],
      lists: [
        {
          id: '5dd9c9d8689d2f1572a5b554',
          name: 'this is test list',
          closed: false,
          idBoard: '5dd9c9ce4243690dc802030e',
          pos: 65535,
          subscribed: false,
          softLimit: null
        }
      ]
    };

    test('valid translate', () => {
      const result = CardService.listDataToCardLists(data);
      expect(result.length).toBe(1);
      expect(result[0].id).toBe('5dd9c9d8689d2f1572a5b554');
      expect(result[0].name).toBe('this is test list');
      expect(result[0].cards[0].name).toBe('this is test card');
    });
  });
});
