// import { CardList } from './card';

// リストからテキストを生成する
// export function listToString(list: CardList) {}

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
