let timeout
export function debounce(func, wait = 3000, immediate = true) {
  // 清除定时器
  if (timeout) {
    clearTimeout(timeout)
  }
  // 立即执行，此类情况一般用不到
  if (immediate) {
    let callNow = !timeout
    timeout = setTimeout(function () {
      timeout = null
      func.apply(this, arguments)
    }, wait)
    if (callNow) func.apply(this, arguments)
  } else {
    // 设置定时器，当最后一次操作后，timeout不会再被清除，所以在延时wait毫秒后执行func回调方法
    timeout = setTimeout(function () {
      func.apply(this, arguments)
    }, wait)
  }
}
