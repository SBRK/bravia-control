import Bravia from 'bravia'
import config from './config'

const {
  bravia: {
    ip,
    port = 80,
    key = '0000',
  } = {},
} = config


const bravia = new Bravia(ip, port, key)

console.log('Connected to TV')

bravia.turnOn = () => bravia.system.invoke('setPowerStatus', '1.0', { status: true })
bravia.turnOff = () => bravia.system.invoke('setPowerStatus', '1.0', { status: false })
bravia.getApplicationList = () => bravia.appControl.invoke('getApplicationList')
bravia.getApplicationUri = async appName => {
  const apps = await bravia.getApplicationList()
  const app = _.find(apps, ({ title }) => {
    const rx = new RegExp(appName, 'gi')
    return rx.test(title)
  })

  if (app) {
    return app.uri
  }

  return null
}

bravia.openApplicationFromUri = (uri, data) => bravia.appControl.invoke('setActiveApp', '1.0', { uri, data })
bravia.openApplication = async (name, data) => {
  const uri = await bravia.getApplicationUri(name)

  if (!uri) {
    throw new Error (`Could not find app ${name}`)
  }

  await bravia.openApplicationFromUri(uri, data)
}

bravia.setInput = (source, port) => bravia.avContent.invoke('setPlayContent', '1.0', { uri: `extInput:${source}?port=${port}` })

bravia.setHdmiInput = port => bravia.setInput('hdmi', port)
bravia.setCompositeInput = port => bravia.setInput('composite', port)

export default bravia
