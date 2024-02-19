const Msg = require('./msg')
// Подключение модуля разбора сообщений от сервера
const readline = require('readline')
const flags = require('./flags')
const getPos3Flags = require('./utils')

// Подключение модуля ввода из командной строки
class Agent {
    constructor() {
        this.position = "l" // По умолчанию левая половина поля
        this.run = false // Игра начата
        this.act = null // Действия
        this.rl = readline.createInterface({ // Чтение консоли
            input: process.stdin,
            output: process.stdout
        })
        this.rl.on('line', (input) => {  // Обработка строки из консоли
            if(this.run) { // Если игра начата
        // ДВижения вперед, вправо, влево, удар по мячу
                if("w" == input) this.act = {n: "dash", v: 100}
                if("d" == input) this.act = {n: "turn", v: 20}
                if("a" == input) this.act = {n: "turn", v: -20}
                if("s" == input) this.act = {n: "kick", v: 100}
        }
        })
        this.x_comp = 0;
        this.y_comp = 0;
    }
    msgGot(msg) { // Получение сообщения
        let data = msg.toString('utf8') // ПРиведение
        this.processMsg(data) // Разбор сообщения
        this.sendCmd() // Отправка команды
    }
    setSocket(socket) { // Настройка сокета
        this.socket = socket
    }
    socketSend(cmd, value) { // Отправка команды
        this.socket.sendMsg(`(${cmd} ${value})`)
    }
    processMsg(msg){ // Обработка сообщения
        let data = Msg.parseMsg(msg) // Разборр сообщения
        if (!data) throw new Error("Parse error\n" + msg)
        // Первое (hear) - начало игры
        if (data.cmd == "hear") this.run = true
        if (data.cmd == "init") this.initAgent(data.p) // Инициализация 
        this.analyzeEnv(data.msg, data.cmd, data.p) // Обработка
    }
    initAgent(p){
        if(p[0] == "r") this.position = "r" // Правая половина поля 
        if(p[1]) this.id = p[1] // id игрока
    }
    analyzeEnv(msg, cmd, p){ // Анализ сообщения
        // console.log("Message: \n")
        // console.log(msg)
        // console.log("Cmd: \n")
        // console.log(cmd)
        // console.log("p: \n")
        // console.log(p)
        if(cmd == "see") {
            // console.log(p[1])
            let flag_coords = [], flag_dists = []
            for (let obj of p) {
                if (typeof(obj) !== 'object') 
                    continue
                let name = obj.cmd.p.join('')
                if (name[0] !== 'f') {
                    continue
                }
                let coords = flags[name]

                if (flag_coords.length == 2) 
                {
                    let x1 = flag_coords[0].x, y1 = flag_coords[0].y
                    let x2 = flag_coords[1].x, y2 = flag_coords[1].y
                    let x3 = coords.x,         y3 = coords.y
                    // Horizontal or vertical lines
                    // if (((x1 == x2) && (x2 == x3)) || 
                    //     ((y1 == y2) && (y2 == y3)))
                    //     continue

                    // // Three point on angled line
                    // const eps = 0.0001
                    // if (Math.abs((y3-y1)/(y2-y1) - (x3-x1)/(x2-x1)) < eps){
                    //     console.log('Skipped same line', x1, x2, x3, y1, y2, y3)
                    // continue
                    // }
                }                
                if (flag_coords.length == 3) 
                    break
                flag_coords.push(coords)
                flag_dists.push(obj.p[0])
            }

            if (flag_coords.length < 3) return false;
            res = getPos3Flags(flag_coords, flag_dists)
 
            this.flag_coords = flag_coords 
            this.x = res['x']
            this.y = res['y']

            for (let obj of p) {
                if (typeof(obj) !== 'object') 
                    continue
                let name = obj.cmd.p.join('')
                if (name[0] !== 'p') {
                    continue
                }
                let enemy_dist = obj.p[0], enemy_angle = obj.p[1]           
                console.log(enemy_dist, enemy_angle)
                console.log(this.turn, this.turn_neck, this.head_angle, this.DirectionOfSpeed)
                enemy_angle = this.DirectionOfSpeed + this.head_angle - enemy_angle 
                let enemy_angle_rad = enemy_angle * Math.PI / 180

                let x = this.x, y = this.y
                let x_e = x + Math.cos(enemy_angle_rad) * enemy_dist
                let y_e = y + Math.sin(enemy_angle_rad) * enemy_dist
                console.log(x_e, y_e)
            }   
        }
        if(cmd == "sense_body") {
            this.turn = 0
            for (let obj of p) {
                if (obj.cmd == 'head_angle') {
                    this.head_angle = obj.p[0]
                }
                if (obj.cmd == 'speed') {
                    this.DirectionOfSpeed = obj.p[1]
                }
            }
        }
    }
    sendCmd(){
        if(this.run){ // Игра начата 
            if(this.act){ // Есть команда от игрока
                if(this.act.n == "kick") // Пнуть мяч
                    this.socketSend(this.act.n, this.act.v + " 0")
                else // Движение и поворот
                    this.socketSend(this.act.n, this.act.v)
            }
            this.act = null // Сброс команды
        }
    }
}
module.exports = Agent // Экспорт игрока