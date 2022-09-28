
function createConnectionToServer(client){
    const PORT = 5000
    const webSocketClient = new WebSocket(`ws://localhost:${PORT}/${client}`)
    return webSocketClient
}
export default createConnectionToServer