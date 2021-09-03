export function getMonday(date) {
  let today = new Date(date) // 月份为0-11
  let yesterdayMilliseconds = today.getTime() - 1000 * 60 * 60 * 24
  let yesterday = new Date()
  yesterday.setTime(yesterdayMilliseconds)

  let strYear = yesterday.getFullYear()
  let strDay = yesterday.getDate()
  let strMonth = yesterday.getMonth() + 1
  if (strMonth < 10) {
    strMonth = '0' + strMonth
  }
  if (strDay < 10) {
    strDay = '0' + strDay
  }
  let strYesterday = strYear + '-' + strMonth + '-' + strDay
  return strYesterday
}

export function changeMonday(date) {
  let today = new Date(date)
  let yesterdayMilliseconds = today.getTime + 1000 * 60 * 60 * 24
  let yesterday = new Date()
  yesterday.toUTCString(yesterdayMilliseconds)
  return yesterday
}
