const Msg = require('./msg')
const readline = require('readline')
const pos = require('./pos')
const flags = require('./flags')
const Controller = require('./controller')
const DT = require('./decisionTree')
const FL = "flag"
const KI = "kick"


class Agent {
  constructor (teamName,manager, init_x, init_y, pose) {
    this.manager = manager
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
    if (data.cmd == 'hear') {
      this.run = true
      if(data.p[2] == 'play_on') {
        this.play_on = true
      } else if(data.p[2] == 'kick_off_l'){
          //this.socketSend('kick', '60 0')
          return
        } else if(data.p[2].startsWith('goal_l')){
            this.socketSend('move', this.init_x + ' ' + this.init_y)
          } else if(data.p[2].startsWith('drop_ball')){
           // this.controller.refresh()
          }
      }
    
    if (data.cmd == 'init') this.initAgent(data.p)
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
          case "middle": this.tree = DT.DT_pride;
                  break;
          case "left": this.tree = DT.DT_pride_2;
                  break;
          case "right":this.tree = DT.DT_pride_3;
      }
  } else {
      this.tree = DT.DT_goalie;
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
    if (this.play_on == true) {
      //this.socketSend('turn', this.turn_moment)
    }

    if (cmd == 'see') {
      let counter = 0
      let flgs = []
      let ball_idx = -1
      let p_idx = -1
      for (let i = 1; i < p.length; i++) {
        if (p[i]['cmd']['p'][0] === 'f') {
          flgs.push(i)
        } else if(p[i]['cmd']['p'][0] === 'b'){
          ball_idx = i
        } else if(p[i]['cmd']['p'][0] === 'p'){
          p_idx = i
        }
      }
      this.coords = this.bestPos(flgs, p)
      flgs.push(p_idx)
      if (this.play_on == true) {
      //  this.controller.run(flgs,p,ball_idx)
        this.act = this.manager.getAction(this.manager, this.tree, p)
        this.sendCmd()
        //managerFunc.getAction(this.manager, this.DT, p)
        //this.manager.getAction(this.DT, p)
      } else {

      }
      
      

      //console.log('my: ', this.coords)

      // let coords_other = this.bestObjPos(flgs, this.coords, p)
      // console.log("enemy: ", coords_other)

    }
  }

  sendCmd () {
    if (this.run) {
      // Игра начата
      if (this.act) {
        // Есть команда от игрока
        if (this.act.n == 'kick') {
          // Пнуть мяч
          this.socketSend(this.act.n, this.act.v)
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
