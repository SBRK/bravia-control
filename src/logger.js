import winston from 'winston'

winston.configure({
  transports: [
    new winston.transports.Console({  
        prettyPrint: true,
        colorize: true,
    })
  ]
})

global.logger = winston
