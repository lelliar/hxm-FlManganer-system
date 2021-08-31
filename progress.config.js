const progressOption = {
  // *func应该是parseMeta方法默认参数
  func: [
    { call: 'color', modifier: 'temp', argument: 'rgba(255, 0, 0, 0.521)' },
    { call: 'fail', modifier: 'temp', argument: 'red' },
    { call: 'location', modifier: 'temp', argument: 'top' },
    {
      call: 'transition',
      modifier: 'temp',
      argument: { speed: '1.5s', opacity: '0.6s', termination: 400 }
    }
  ]
}
export default progressOption
