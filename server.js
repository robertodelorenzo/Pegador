import express from 'express'
import http from 'http'
import createGame from './public/game.js'
// import socketio from 'socket.io'
import * as socketio from "socket.io"

const app = express()
const server = http.createServer(app) // server é uma instancia padrao de um módulo http, está ligao ao node express
// const sockets = socketio(server)
const sockets = new socketio.Server(server);
// a factory socketio recebe o parametro server, está ligado ao http, e este ao express as conexcoes acima estão interligadas e conversão entre si

app.use(express.static('public'))

const game = createGame()
// game.start() // MARCA

// Observer para ficar observando o jogo, a cada comando que acontecer (addPlayer), irá emitir este comando para clientside(index.html) 
game.subscribe((command) => {  // recebe o comando e reenvia no clienteside(index.html)
    console.log(`> Emitting ${command.type}`) // Emite para todos os outros clients conectados
    sockets.emit(command.type, command) // Emite o tipo do comando e o objeto inteiro do comando
})

// instalar a dependencia socket.on:  Como o servidor vai centralizar vários sockets, isto abaixo é uma lista de socket´s (terão vários sockets conectados aqui dentro).  Quando um destes sockets conseguir conectar, este socket também irá emitir um evento de 'connection'.   Dentro do callback (socket) ele vai injetar o socket em questão, 
// Ex: Dado um client, que não se conectou ainda, se conecta no servidor, ele vai emitir este evento, e vai injetar este "objeto de socket" para dentro desta função.
sockets.on('connection', (socket) => {
    const playerId = socket.id // assim que conexao retornar com sucesso, pego o id do socket e coloco com id do player (playerId)
    console.log(`> Player connected: ${playerId}`)

    game.addPlayer({ playerId: playerId }) // Utilizo o playerId para adicionar um novo jogador
    // console.log(game.state) 

    socket.emit('setup', game.state) // Momento em que o client se conecta

    socket.on('disconnect', () => {
        game.removePlayer({ playerId: playerId })
        console.log(`> Player disconnected: ${playerId}`)
    })

    socket.on('move-player', (command) => {
        command.playerId = playerId // mesmo que o client altere o command passando um plaer falso, eu pego o playerId do socket para evitar adulteração 
        command.type = 'move-player'

        game.movePlayer(command) // move no servdiro, de forma abstrata este jogador
    })
})

server.listen(3000, () => {
    console.log(`> Server listening on port: 3000`)
})