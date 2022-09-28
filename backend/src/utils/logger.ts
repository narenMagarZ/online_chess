import winston from "winston"
import colors from 'colors'
import {resolve,join} from 'node:path'


const errorColor = colors.red.bold
const infoColor = colors.blue.bold
const successColor = colors.green.bold
const warnColor = colors.yellow.bold

const logger = winston.createLogger({
    transports:[
        new winston.transports.File({
        })
    ]
})

