let localConfig = {}

try {
  localConfig = require('./config.local').default
} catch (ex) {
  localConfig = {}
}

const config = {
  bravia: {
    ip: '192.168.0.23',
    port: 80,
    key: '0000',
  },
  securityKey: null,
  port: 4242,
  ...localConfig
}

export default config
