import http from 'node:http'
import wsServer from './wsserver'
import app from './app'
const PORT = process.env.PORT || 5000

function createServer(){
    const httpServer = http.createServer(app)
    wsServer(httpServer)
    httpServer.listen(PORT)
}
createServer()
