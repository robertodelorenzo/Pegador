export default function createKeyboardListener(document) {
    const state = {
        observers: [] // objeto que contem a lista de observers:
    }

    function subscribe(observerFunction) {
        // esta é a forma que o "Observer" consegue se registrar dentro de um "Subject"
        state.observers.push(observerFunction) // para guardar esta funcao em algum lugar, dentro de um array chamado "observers"
    }

    function notifyAll(command) {
        for (const observerFunction of state.observers) {
            observerFunction(command) // executo a funcao passada
        }
    }

    document.addEventListener('keydown', handleKeyDown)

    function handleKeyDown(event) {
        const keyPressed = event.key

        const command = {
            playerId: 'player1',
            keyPressed
        }

        // game.movePlayer(command)
        notifyAll(command)
    }   
    
    return {
        subscribe
    }
}
