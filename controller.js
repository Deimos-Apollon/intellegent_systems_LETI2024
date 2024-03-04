class Controller {
    constructor() {
        this.flag_max_dist = 3
        this.ball_max_dist = 0.5
        this.min_turn_angle = 5
    }
    moveToFlag(agent, flag, see) {
        let flag_obj = null
        // check agent can see the needed flag
        if (typeof(see) != 'object') {
            this.turnAgent(agent, 15)
            return false;
        }
        for (let obj of see) {
            if (typeof(obj) !== 'object') 
                continue
            let name = obj.cmd.p.join('')
            if (name === flag) {
                flag_obj = obj
                break
            }
        }
        if (flag_obj) {
            return this.moveAgentToObj(agent, flag_obj, this.flag_max_dist)
        }
        this.turnAgent(agent, 15)
        return false
    }

    makeGoal(agent, flag, see) {
        let flag_obj = null, ball = null
        for (let obj of see) {
            if (typeof(obj) !== 'object') 
                continue
            let name = obj.cmd.p.join('')
            if (name === flag && obj.p[0] < 50)
                flag_obj = obj
            if (name[0] === 'b')
                ball = obj
            if (ball && flag_obj)
                break
        }
        if (!ball) {
            this.turnAgent(agent, 15)
            return false
        }
        if (!this.moveAgentToObj(agent, ball, this.ball_max_dist))
            return false
        if (!flag_obj) {
            this.kickBall(agent, 20, 45)
            return false
        }

        const flag_angle = flag_obj.p[1]
        this.kickBall(agent, 1000, flag_angle)
        return false
    }

    moveAgentToObj(agent, obj, max_dist) {
        const obj_dist = obj.p[0]
        if (obj_dist < max_dist)
            return true
        const obj_angle = obj.p[1]
        if (Math.abs(obj_angle) > this.min_turn_angle) { 
            this.turnAgent(agent, obj_angle)
            return false
        }
        // run slower if its not too far
        // check if it is acceleration or absolute speed
        this.runAgent(agent, obj_dist > 10 ? 50 : 30)
        return false
    }

    turnAgent(agent, angle) {
        agent.act = {n: "turn", v: angle}
        agent.socketSend("turn", angle)
    }

    runAgent(agent, power) {
        agent.act = {n: "dash", v: power}
        agent.socketSend("dash", power)
    }

    kickBall(agent, power, angle) {
        // agent.act = {n: "kick", v: power + ' ' + angle}
        agent.socketSend("kick", `${power} ${angle}`)
    }
}

module.exports = Controller // Экспорт игрока