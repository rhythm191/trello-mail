import { CardList } from '../src/card';
import { escapeMailText, listToString } from '../src/utils';

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
