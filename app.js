const Agent = require('./agent') // Импорт агента
const VERSION = 7 // Версия сервера
const args = process.argv;
console.log(args)
let teamName = 'teamA' // Имя команды
const Manager = require('./manager')

const state = require('./decisionTree')

var createAgent = function createAgent(teamName, pos1, pos2, turn, pose){
    let agent1 = new Agent(teamName, new Manager(), pos1, pos2, pose) // Создание экземпляра агента
    require('./socket')(agent1, teamName, VERSION) // Настройка сокета
    setTimeout(function() {
        agent1.socketSend('move', pos1 + ' ' + pos2) // Размещение игрока на поле
        agent1.turn_moment = turn
        agent1.init_x = pos1
        agent1.init_y = pos2
      }, 20);
}

createAgent(teamName, '-10','0', 1, "middle")
createAgent(teamName, '-17','-7', 1, "left")
createAgent(teamName, '-17','7', 1, "right")
createAgent("teamB", '-50','0', 1, "goalie")
