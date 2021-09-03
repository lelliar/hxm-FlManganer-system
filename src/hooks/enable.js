import { handleCofirm } from '@/hooks/messageBox'
import { getData } from '@/service/commonRequest'
import { Message } from 'element-ui'
export function enable(row, textType) {
  if (row.planStatusMsg == textType) {
    Message({
      type: 'success',
      message: `当前计划已经${textType}了嗷!`
    })
  } else {
    handleCofirm(`你确认要${textType}${row.planWorkShopName}计划吗`).then((res) => {
      getData('/plan/startAndStop', { planId: row.planId, planStatus: row.planStatus }).then(
        (res) => {
          Message({
            type: 'success',
            message: `${textType}成功`
          })
        }
      )
    })
  }
}
// 传入当前状态值，匹配状态值，响应文本，地址，请求参数
export function commonEnable(row, textType, textMessage, url, form) {
  if (row == textType) {
    Message({
      type: 'success',
      message: `当前人员已经${textMessage}了嗷！`
    })
  } else {
    handleCofirm(`你确认要${textMessage}当前人员吗`).then((res) => {
      getData(url, form).then((res) => {
        Message({
          type: 'success',
          message: '添加成功'
        })
      })
    })
  }
}
