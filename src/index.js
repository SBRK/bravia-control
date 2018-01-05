import './logger'
import config from './config'
import bravia from './bravia'
import _ from 'lodash'
import openurl from 'openurl'
import express from 'express'
import bodyParser from 'body-parser'


const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

if (config.securityKey) {
  app.use('*', (req, res, next) => {
    if (!req.body.key || req.body.key !== config.securityKey) {
      return next(new Error('Unauthorized'))
    }

    return next()
  })
}

app.get('/', (req, res) => {
  res.send('running')
})

app.post('/turn-on', async (req, res) => {
  logger.info('turn-on', req.body)

  await bravia.turnOn()

  return res.json({ success: true })
})

app.post('/turn-off', async (req, res) => {
  logger.info('turn-off', req.body)

  await bravia.turnOff()

  return res.json({ success: true })
})

app.post('/launch-steam-app', async (req, res) => {
  logger.info(req.body.app)
  const appname = req.body.app.replace(/^[A-Z]+ /i, '').replace(/ [A-Z]+$/i, '')
  
  logger.info('launch-steam-app', appname)

  const appId = 252950

  openurl.open(`steam://open/bigpicture`)
  openurl.open(`steam://run/${appId}`)

  await bravia.turnOn()
  await bravia.setHdmiInput(2)

  res.json({ success: true })
})

app.post('/launch-steam', async (req, res) => {
  logger.info('launch-steam', req.body)

  openurl.open(`steam://open/bigpicture`)

  await bravia.turnOn()
  await bravia.setHdmiInput(2)

  res.json({ success: true })
})

app.post('/launch', async (req, res) => {
  logger.info('launch', req.body)

  await bravia.turnOn()
  
  try {
    await bravia.openApplication(req.body.app.replace(' lance ', '').replace(' sur la', '').replace(' ouvre ', '').replace(' Sur la', ''))
  } catch (e) {
    return res.status(404).json({ success: false })
  }

  return res.json({ success: true })
})

app.listen(config.port)
