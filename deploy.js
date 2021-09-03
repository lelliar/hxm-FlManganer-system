const Client = require('ssh2-sftp-client')

const dayjs = require('dayjs')

require('events').EventEmitter.defaultMaxListeners = 0

let devTask = [
  {
    name: 'test',

    ssh: {
      host: '192.168.0.44',

      port: 22,

      username: 'root',

      password: 'YunQue!2017'
    },

    romotePath: '/root/html',

    localPath: './dist',

    backup: true
  }
]

const main = async (config) => {
  try {
    const sftp = new Client()

    console.log('- 开始部署: ' + config.name + ' ...')

    const fullPath = config.romotePath + '/' + config.name

    await sftp.connect(config.ssh)

    // backup source file

    if (config.backup) {
      const isExists = await sftp.exists(fullPath)

      if (isExists) {
        const rename = fullPath + '_backup' + dayjs().format('YYYY-MM-DD_hh:mm:ss')

        await sftp.rename(fullPath, rename)

        console.log('- 原文件位置：' + rename)
      }
    }

    await sftp.uploadDir(config.localPath, fullPath)

    console.log('- 部署成功: ' + config.name)

    await sftp.end()
  } catch (error) {
    console.log('- 出错了!快看看怎么回事!\nerr:', error.message)
  }
}

devTask.forEach((config) => {
  main(config)
})
