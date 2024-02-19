    const Agent = require('./agent'); // Импорт агента
    const VERSION = 7; // Версия сервера
    let teamName = "teamA"; // ИМЯ команды
    let enemyTeamName = "teamB";
    let agents = []

    let agent = new Agent()
    let enemy = new Agent()
    // const AGENTS_NUM = 9
    // for (let i=0; i < AGENTS_NUM;++i) agents.push(new Agent()); // Создание экземпляра агента

    let socket = require('./socket')
    // for (let i=0; i < AGENTS_NUM;++i) socket(agents[i], teamName, VERSION) //Настройка сокета
    socket(agent, teamName, VERSION) 
    socket(enemy, enemyTeamName, VERSION) 

    let time = 1000

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // function check_for_errors(true_coords, comp_coords) {
    //     x_t = true_coords[0]
    //     y_t = true_coords[1]
    //     x_p = comp_coords[0]
    //     y_p = comp_coords[1]

    //     if (Math.abs(x_t - x_p) > 10) {
    //         return false
    //     }
    //     if (Math.abs(y_t - y_p) > 10) {
    //         return false
    //     }
    //     return true
    // }

    agent.is_player = true;

    async function moveCircle(){
        agent.socketSend("move", "-15 -10")
        enemy.socketSend("move", "-15 -10")

        while(true){
            agent.socketSend("turn", `-15`)
            await sleep(time)
            console.log()
        }
    }
    
    moveCircle()

    // async function moveCircle(){
    //     true_agent_coords = [
    //         [-15, 0]
    //         // [-15, 0], [-15, 15], [-15, -15],
    //         // [-32, 0], [-32, 15], [-32, -15],
    //         // [-50, 0], [-50, 15], [-50, -15]
    //     ]
    //     for (let i=0; i < AGENTS_NUM;++i)
    //         agents[i].socketSend("move", `${true_agent_coords[i][0]} ${-1 * true_agent_coords[i][1]}`) // Размещение игрока на поле

    //     while(true){
    //         for (let i=0; i < AGENTS_NUM;++i)
    //             agents[i].socketSend("turn", `15`)
    //         await sleep(time)
    //         for (let i=0; i < AGENTS_NUM;++i){
    //             res = check_for_errors(true_agent_coords[i], [agents[i].x, agents[i].y])
    //             if (!res) {
    //                 console.log(true_agent_coords[i], [agents[i]['x'], agents[i]['y']], agents[i].flag_coords)
    //             }
    //         }
    //         for (let i=0; i < AGENTS_NUM; ++i)
    //             agents[i].socketSend("dash", '100')
    //         // agent.socketSend("dash", '100')
    //         // await sleep(time)
    //     }
    // }

    // moveCircle()