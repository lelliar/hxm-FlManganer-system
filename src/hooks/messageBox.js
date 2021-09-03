import { MessageBox } from 'element-ui'

export function handleCofirm(text = '你确认执行此操作吗', type = 'error') {
  return MessageBox.confirm(text, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消'
  })
}
