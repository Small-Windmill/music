import pinyin from 'js-pinyin';

export function Getinitial(string) {
  let pinyin = require('js-pinyin');
  pinyin.setOptions({ checkPolyphone: false, charCase: 0 });
  return pinyin.getCamelChars(string).substring(0, 1);
}
