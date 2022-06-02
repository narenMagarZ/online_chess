import express from 'express'
import http from 'node:http'
import WsServer from './wsserver'
const PORT = process.env.PORT || 5000

const expressApp = express()
const httpServer = http.createServer(expressApp)

httpServer.listen(PORT)
WsServer(httpServer)