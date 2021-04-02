export default function createGame() { // é uma Factory, cria a instancia do jogo
    const state = {
        players: {},
        fruits: {},
        screen: {
            width: 10,
            height: 10
        }
    }

    const observers = [] // Nao foi declarado no state porque não quero mandar uma lista de observers

    function subscribe(observerFunction) {
        // esta é a forma que o "Observer" consegue se registrar dentro de um "Subject"
        observers.push(observerFunction) // para guardar esta funcao em algum lugar, dentro de um array chamado "observers"
    }

    function notifyAll(command) {
        for (const observerFunction of observers) {
            observerFunction(command) // executo a funcao passada
        }
    }

    function setState(newState) {
        Object.assign(state, newState)
    }

    function addPlayer(command) {
        const playerId = command.playerId
//      const playerX = command.playerX
//      const playerY = command.playerY
        const playerX = 'playerX' in command ? command.playerX : Math.floor(Math.random() * state.screen.width) // Se dentro do command houver playerX, utilizo ele, senão, criou um valor randomico:
        const playerY = 'playerY' in command ? command.playerY : Math.floor(Math.random() * state.screen.height)

        state.players[playerId] = {
            x: playerX,
            y: playerY
        }

        // Toda vez que o addPlayer for rodado, irá notificar todos os observers que tal evento aconteceu:
        notifyAll({
            type: 'add-player',
            playerId: playerId,
            playerX: playerX,
            playerY: playerY
        })
    }

    function removePlayer(command) {
        const playerId = command.playerId

        delete state.players[playerId]

        // Notifica todos os observers que este evento removePlayer aconteceu para este playerId:
        notifyAll({
            type: 'remove-player',
            playerId: playerId
        })
    }

    function addFruit(command) {
        const fruitId = command.fruitId
        const fruitX = command.fruitX
        const fruitY = command.fruitY

        state.fruits[fruitId] = {
            x: fruitX,
            y: fruitY
        }
    }

    function removeFruit(command) {
        const fruitId = command.fruitId

        delete state.fruits[fruitId]
    }

    function movePlayer(command) {
        const acceptedMoves = {
            ArrowUp(player) {
                if (player.y -1 >= 0) {
                    player.y = player.y - 1
                }
            },
            ArrowRight(player) {
                if (player.x + 1 < state.screen.width) {
                    player.x = player.x + 1
                }
            },
            ArrowDown(player) {
                if (player.y + 1 < state.screen.height) {
                    player.y = player.y + 1
                }
            },
            ArrowLeft(player) {
                if (player.x -1 >= 0) {
                    player.x = player.x - 1
                }
            }
        }

        const keyPressed = command.keyPressed // event.key
        const playerId = command.playerId
        const player = state.players[command.playerId]
        const moveFunction = acceptedMoves[keyPressed]

        if (player && moveFunction) { // Se tecla nao for underfined:
            moveFunction(player)
            checkForFruitCollision(playerId)
        }

    }

    // colisão:
    function checkForFruitCollision(playerId) {
        const player = state.players[playerId]

        for (const fruitId in state.fruits) {
            const fruit = state.fruits[fruitId]
            console.log(`Checking ${playerId} and ${fruitId}`)

            if (player.x === fruit.x && player.y === fruit.y) {
                console.log(`COLLISION between ${playerId} and ${fruitId}`)
                removeFruit({ fruitId: fruitId})
            }
        }
    }

    return {
        addPlayer,
        removePlayer,
        movePlayer,
        addFruit,
        removeFruit,
        state,
        setState,
        subscribe
    }

}
