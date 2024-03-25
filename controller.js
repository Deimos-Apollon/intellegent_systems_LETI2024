class Controller {
    constructor() {
        this.flag_max_dist = 3
        this.ball_max_dist = 1
        this.min_turn_angle = 30
        this.default_turn_angle = 30
    }
    moveToFlag(agent, flag, see) {
        let flag_obj = null
        // check agent can see the needed flag
        if (typeof(see) != 'object') {
            this.turnAgent(agent, this.default_turn_angle)
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
        this.turnAgent(agent, this.default_turn_angle)
        return false
    }

    makeGoal(agent, flag, see) {
        let flag_obj = null, ball = null
        for (let obj of see) {
            if (typeof(obj) !== 'object') 
                continue
            let name = obj.cmd.p.join('')
            if (name === flag && obj.p[0] < 1000) {
                flag_obj = obj
            }
            if (name[0] === 'b')
                ball = obj
            if (ball && flag_obj)
                break
        }
        if (!ball) {
            this.turnAgent(agent, this.default_turn_angle)
            return false
        }
        if (!this.moveAgentToObj(agent, ball, this.ball_max_dist))
            return false
        if (!flag_obj) {
            //const agent_angle = agent.DirectionOfSpeed
            this.kickBall(agent, 10, 45)
            return false
        }

        const flag_angle = flag_obj.p[1]
        this.kickBall(agent, 100, flag_angle)
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
        if (obj_dist > 10) this.runAgent(agent, 100)
        else if (obj_dist > 5) this.runAgent(agent, 70)
        else if (obj_dist > 3) this.runAgent(agent, 50)
        else  this.runAgent(agent, 25)
        return false
    }

    turnAgent(agent, angle) {
        agent.act = {n: "turn", v: angle}
    }

    runAgent(agent, power) {
        agent.act = {n: "dash", v: power}
    }

    kickBall(agent, power, angle) {
        agent.act = {n: "kick", v: power + ' ' + angle}
    }
}

module.exports = Controller // Экспорт игрока