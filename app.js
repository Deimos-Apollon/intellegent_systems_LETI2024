    const Agent = require('./agent'); // Импорт агента
    const VERSION = 7; // Версия сервера
    const Controller = require('./controller')
    let teamName = "teamA"; // ИМЯ команды
    let enemyTeamName = "teamB";
    let agents = []

    let agent = new Agent()
    // let enemy = new Agent()
    // const AGENTS_NUM = 9
    // for (let i=0; i < AGENTS_NUM;++i) agents.push(new Agent()); // Создание экземпляра агента

    let socket = require('./socket')
    // for (let i=0; i < AGENTS_NUM;++i) socket(agents[i], teamName, VERSION) //Настройка сокета
    socket(agent, teamName, VERSION) 
    // socket(enemy, enemyTeamName, VERSION) 

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    let time = 1000

    agent.is_player = true;
    agent.socketSend("move", "-15 10")
    // enemy.socketSend("move", "-50 0")

    sleep(time)
    let controller = new Controller()

    async function run() {
        let actions_done = [false, false, false]
        console.log(actions_done)
        while(true) {
            await sleep(100)
            if (!actions_done[0]) {
                res = controller.moveToFlag(agent, 'b', agent.see)
                if (res) actions_done[0] = true;
            }
            if (!actions_done[1]) {
                res = controller.moveToFlag(agent, 'fc', agent.see)
                if (res) actions_done[1] = true;
            }
            if (!actions_done[2]) {
                if (!agent.see) continue;
                res = controller.makeGoal(agent, 'gr', agent.see)
                // if (res) actions_done[2] = true;
            }
            if (actions_done[2]) {
                actions_done = [false] * 3
            }
        }
    }
    
    run()
    
    // async function runAndGoal(){
        
    //     agent.socketSend("move", "-15 10")
    //     await sleep(1000)
    //     enemy.socketSend("move", "-15 10")
    //     agent.socketSend("turn", `-15`)
    //     await sleep(1000)

    //     while(true) {
    //         agent.socketSend("turn", `-15`)
    //         await sleep(time)
    //         console.log()
    //     }
    // }
    

    // moveCircle()

