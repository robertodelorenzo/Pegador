export default function createKeyboardListener(document) {
    const state = {
        observers: [], // objeto que contem a lista de observers:
        playerId: null
    }

    function registerPlayerId(playerId) { // Registra de forma dinamica um playerId
        state.playerId = playerId
    }

    function subscribe(observerFunction) { // esta é a forma que o "Observer" consegue se registrar dentro de um "Subject"
        state.observers.push(observerFunction) // para guardar esta funcao em algum lugar, dentro de um array chamado "observers"
    }

    function notifyAll(command) {
        for (const observerFunction of state.observers) {
            observerFunction(command) // executo a "funcao" inteira, passada como parâmetro
        }
    }

    document.addEventListener('keydown', handleKeydown)

    function handleKeydown(event) {
        const keyPressed = event.key

        const command = {
            type: 'move-player', // MARCA
            playerId: state.playerId,
            keyPressed
        }

        notifyAll(command)
    }
    
    return {
        subscribe,
        registerPlayerId
    }
}
