import express from 'express'
import http from 'http'
import createGame from './public/game.js'
// import socketio from 'socket.io'
import * as socketio from "socket.io"

const app = express()
const server = http.createServer(app) // server é uma instancia padrao de um módulo http, está ligao ao node express
// const sockets = socketio(server) 
const sockets = new socketio.Server(server);
// a factory socketio recebe o parametro server, está ligado ao http, e este ao express
// as conexcoes acima estão interligadas e conversão entre si

app.use(express.static('public'))

const game = createGame()
// game.addPlayer({ playerId: 'player1', playerX: 0, playerY: 0})
// game.addPlayer({ playerId: 'player2', playerX: 7, playerY: 0})
// game.addPlayer({ playerId: 'player3', playerX: 9, playerY: 0})
// game.addFruit({ fruitId: 'fruit1', fruitX: 3, fruitY: 3})
// game.addFruit({ fruitId: 'fruit2', fruitX: 3, fruitY: 5})
// game.movePlayer({ playerId: 'player1', keyPressed: 'ArrowRight'})

// console.log(game.state)

// instalar a dependencia socket.on:
// Como o servidor vai centralizar vários sockets, isto abaixo é uma lista de socket´s (terão vários sockets conectados aqui dentro)
// Quando um destes sockets conseguir conectar, este socket também irá emitir um evento de 'connection'
// Dentro do callback (socket) ele vai injetar o socket em questão, 
// Ex: Dado um client, que não se conectou ainda, se conecta no servidor, ele vai emitir este evento,
//     e vai injetar este "objeto de socket" para dentro desta função.
sockets.on('connection', (socket) => {
    const playerId = socket.id // assim que conexao retornar com sucesso, pego o id do socket e coloco com id do player (palyerId)
    console.log(`> Player connected on Server with id: ${playerId}`)

    game.addPlayer({ playerId: playerId }) // Utilizo o palyerId para adicionar um novo jogador
    console.log(game.state) 

    socket.emit(`setup`, game.state)
})

server.listen(3000, () => {
    console.log(`> Server listening on port: 3000`)
})