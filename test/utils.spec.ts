import { CardList } from '../src/card';
import {
  escapeMailText,
  listDataToCardLists,
  listToString
} from '../src/utils';

describe('Utils', () => {
  describe('escapeMailText', () => {
    test('% -> %25', () => {
      expect(escapeMailText('test%')).toBe('test%25');
    });
    test('¥n -> %0d%0a', () => {
      expect(escapeMailText('test\n')).toBe('test%0d%0a');
    });
    test('= -> %3D', () => {
      expect(escapeMailText('test=')).toBe('test%3D');
    });
    test('& -> %26', () => {
      expect(escapeMailText('test&')).toBe('test%26');
    });
    test(', -> %2C', () => {
      expect(escapeMailText('test,')).toBe('test%2C');
    });
    test('space -> %20', () => {
      expect(escapeMailText('test ')).toBe('test%20');
    });
    test('? -> %3f', () => {
      expect(escapeMailText('test?')).toBe('test%3f');
    });
  });

  describe('listDataToCardLists', () => {
    const data = {
      id: '5dd9c9ce4243690dc802030e',
      name: 'test',
      desc: '',
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
      const result = listDataToCardLists(data);
      expect(result.length).toBe(1);
      expect(result[0].id).toBe('5dd9c9d8689d2f1572a5b554');
      expect(result[0].name).toBe('this is test list');
      expect(result[0].cards[0].name).toBe('this is test card');
    });
  });

  describe('listToString', () => {
    test('no card', () => {
      const list: CardList = {
        id: 'xxx',
        name: 'hoge',
        cards: []
      };

      const result = `hoge
-------

`;

      expect(listToString(list)).toBe(result);
    });

    test('2 card', () => {
      const list: CardList = {
        id: 'xxx',
        name: 'hoge',
        cards: [{ name: 'hoge' }, { name: 'fuga' }]
      };

      const result = `hoge
-------

* hoge
* fuga
`;

      expect(listToString(list)).toBe(result);
    });
  });
});
