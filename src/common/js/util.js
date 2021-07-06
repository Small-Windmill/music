function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
export function shuffle(arr) {
  let _arr = arr.slice();
  for (let i = 0; i < _arr.length; i++) {
    let j = getRandomInt(0, i);
    let t = _arr[i];
    _arr[i] = _arr[j];
    _arr[j] = t;
  }
  return _arr;
}
export function debounce(func, delay) {
  // 接收一个函数和节流时间参数
  let timer;// 计时器
  // 对一个函数做节流就会返回一个新的函数，这个新的函数就会延迟执行我们要节流的函数。在延迟期间这个函数又被调用了，之前的计时器就会清空，又会设置定时器去延迟执行这个函数。
  return function (...args) {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}
