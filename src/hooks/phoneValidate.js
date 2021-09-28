export function regNumber(mobileNo) {
  var move =
    /^((134)|(135)|(136)|(137)|(138)|(139)|(147)|(150)|(151)|(152)|(157)|(158)|(159)|(178)|(182)|(183)|(184)|(187)|(188)|(198))\d{8}$/g
  var link =
    /^((130)|(131)|(132)|(155)|(156)|(145)|(185)|(186)|(176)|(175)|(170)|(171)|(166))\d{8}$/g
  var telecom = /^((133)|(153)|(173)|(177)|(180)|(181)|(189)|(199))\d{8}$/g
  if (move.test(mobileNo)) {
    return true
  } else if (link.test(mobileNo)) {
    return true
  } else if (telecom.test(mobileNo)) {
    return true
  } else {
    return false
  }
}
export function isCardNo(card) {
  // 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
  var reg =
    /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/g
  if (reg.test(card)) {
    return true
  } else {
    return false
  }
}
