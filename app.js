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
        actions = [{act: "moveToFlag", fl: "b"}, {act: "kick", fl: "gr"}]
        let current_action_index = 0

        while(true) {
            await sleep(100)
            let curr_act = actions[current_action_index]
            let res = false;
            switch (curr_act.act) {
                case "moveToFlag": {
                    res = controller.moveToFlag(agent, curr_act.fl, agent.see);
                    break
                }
                case "kick": {
                    res = controller.makeGoal(agent, curr_act.fl, agent.see);
                    break
                }
            }

            if (res) current_action_index = (current_action_index < actions.length-1) ? current_action_index+1 : 0;
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

