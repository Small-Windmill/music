import pinyin from 'js-pinyin';

export function Getinitial(string) {
  let pinyin = require('js-pinyin');
  pinyin.setOptions({ checkPolyphone: false, charCase: 0 });
  // getCamelChars()中传入的参数不是汉字时，不会进行转换，仍然输出源字符串。
  return pinyin.getCamelChars(string).substring(0, 1).toUpperCase();
}
