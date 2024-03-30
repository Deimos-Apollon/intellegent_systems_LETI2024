const Msg = require('./msg')
// Подключение модуля разбора сообщений от сервера
const readline = require('readline')
// модуль ввода из командной строки
const pos = require('./pos')
const flags = require('./flags')
const Controller = require('./Controller')
const FL = "flag"
const KI = "kick"
const DT = require('./decisionTree')
const Mgr = require('./manager')

class Agent {
  constructor (teamName, init_x, init_y, pose) {
    this.pose = pose
    this.init_x = init_x
    this.init_y = init_y
    this.position = 'l' // По умолчанию - левая половина поля
    this.other = 'r'
    this.run = false // Игра начата
    this.act = null // Действия
    this.play_on = false
    this.turn_moment = 0
    this.coords = {x: NaN, y: NaN}
    this.teamName = teamName
    this.cmd = ''
    if(this.pose == "goalie"){
      this.ta = require('./goalie')
    } else if(this.pose == "nothing"){
      this.ta = null
    } else {
      this.ta = require('./player')
    }
  }

  msgGot (msg) {
    // Получение сообщения
    let data = msg.toString('utf8') // Приведение к строке
    this.processMsg(data) // Разбор сообщения
    this.sendCmd() // Отправка команды
  }

  setSocket (socket) {
    // Настройка сокета
    this.socket = socket
  }

  socketSend (cmd, value) {
    // Отправка команды
    this.socket.sendMsg(`(${cmd} ${value})`)
  }

  processMsg (msg) {
    // Обработка сообщения
    let data = Msg.parseMsg(msg)
    if (!data) throw new Error('Parse error\n' + msg)
    // Первое (hear) - начало игры
    if (data.cmd == 'hear' && data.p[1] == "referee") {
      this.run = true
      console.log(data.p[2])
      if(data.p[2] == 'play_on') {
        this.run = true
      }
    }
    
    if (data.cmd == 'init') 
      this.initAgent(data.p)
    this.analyzeEnv(data.msg, data.cmd, data.p)
  }

  initAgent (p) {
    if (p[0] == 'r') {
      this.position = 'r'
      this.other = 'l'
    } // Правая половина поля
    if (p[1]) this.id = p[1] // id игрока
    if (this.teamName === 'teamA') {
      switch (this.pose) {
          case "left": this.tree = DT.DT_TeamA1;
                  break;
          case "right": this.tree = DT.DT_TeamA2;
                  break;
          case "goalie":this.tree = DT.DT_TeamB;
      }
    } else {
      this.tree = DT.DT_TeamB;
    }
  }

  bestPos(flgs, p) {
    let pairs_count = 0
    let sum = {x: 0, y: 0};
    
    for(let i = 0; i < flgs.length-2; i++){
      for(let j = i+1; j < flgs.length-1; j++){
        for(let k = j+1; k < flgs.length; k++){
          let f1 = p[flgs[i]]['cmd']['p'].join('')
          let d1 = p[flgs[i]]['p'][0]
          let alpha1 = p[flgs[i]]['p'][1]
          let f2 = p[flgs[j]]['cmd']['p'].join('')
          let d2 = p[flgs[j]]['p'][0]
          let alpha2 = p[flgs[j]]['p'][1]
          let f3 = p[flgs[k]]['cmd']['p'].join('')
          let d3 = p[flgs[k]]['p'][0]
          let coords = pos.twothreeFlags(flags[f1], d1, flags[f2], d2, flags[f3], d3)
          if(!isNaN(coords.x) && !isNaN(coords.y)){
            sum.x += coords.x;
            sum.y += coords.y;
            pairs_count += 1;
          }
        }
      }
    }
    sum.x /= pairs_count
    sum.y /= pairs_count
    return sum
  }

  bestObjPos(flgs, coords, p){
    let res = []
    // iterate all people at view
    for (let m = 1; m < p.length; m++) {
      if (
        p[m]['cmd']['p'][0] == 'p' &&
        p[m]['cmd']['p'][1] != this.teamName
      ){
        let p_d = p[m]['p'][0]
        let p_alpha = p[m]['p'][1]
        let pairs_count = 0
        let sum = {x: 0, y: 0};
        // find coords of each
        for(let i = 0; i < flgs.length-1; i++){
          for(let j = i+1; j < flgs.length; j++){
            let f1 = p[flgs[i]]['cmd']['p'].join('')
            let d1 = p[flgs[i]]['p'][0]
            let alpha1 = p[flgs[i]]['p'][1]
            let f2 = p[flgs[j]]['cmd']['p'].join('')
            let d2 = p[flgs[j]]['p'][0]
            let alpha2 = p[flgs[j]]['p'][1]

            let coords_enemy = pos.getObjPos(coords, flags[f1], d1, alpha1, flags[f2], d2, alpha2, p_d, p_alpha)
            if(!isNaN(coords_enemy.x) && !isNaN(coords_enemy.y)){
              sum.x += coords_enemy.x;
              sum.y += coords_enemy.y;
              pairs_countords_enemy.x;
              sum.y += coords_enemy.y;
              pairs_count += 1;
            }
          }
        }
        sum.x /= pairs_count
        sum.y /= pairs_count
        res.push(sum)
      }
    }
    return res
  }


  analyzeEnv (msg, cmd, p) {
    // Анализ сообщения
    if (cmd == "see" && this.run) {
      this.act = Mgr.getAction(p, this.ta, this.teamName, this.position, false)
    }
  }

  sendCmd () {
    if (this.run) {
      // Игра начата
      if (this.act) {
        // Есть команда от игрока
        if (this.act.n == 'kick') {
          // Пнуть мяч
          this.socketSend(this.act.n, this.act.v + " " + this.act.a)
        } else {
          // Движение и поворот
          this.socketSend(this.act.n, this.act.v)
        }
      }
      this.act = null // Сброс команды
    }
  }
}

module.exports = Agent // Экспорт игрока
