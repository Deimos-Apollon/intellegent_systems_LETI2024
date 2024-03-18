const FL = "flag"
const KI = "kick"

const DT_pride = {
  state: {
      next: 0,
      sequence: [{act: KI, fl: "b", goal: "gr"}],
      command: null,
      role: "main"
  },
  root: {
      exec(mgr, state) { state.action =
          state.sequence[state.next]; state.command = null },
      next: "goalVisible",
  },
  goalVisible: {
      condition: (mgr, state) => mgr.getVisible(state.action.fl),
      trueCond: "rootNext",
      falseCond: "rotate",
  },

  rotate: {
      exec (mgr, state) { state.command = {n: "turn", v: "90"} },
      next: "sendCommand",
  },
  rootNext: {
      condition: (mgr, state) => state.action.act == FL,
      trueCond: "flagSeek",
      falseCond: "ballSeek",
  },
  flagSeek: {
      condition: (mgr, state) => 3 >
          mgr.getDistance(state.action.fl),
      trueCond: "closeFlag",
      falseCond: "farGoal",
  },
  closeFlag: {
      exec(mgr, state)
      {state.next = (state.next + 1) % state.sequence.length; state.action = state.sequence[state.next], console.log("111"+state.action.fl)},
      next: "root",
  },
  farGoal: {
      condition:
          (mgr, state) => Math.abs(mgr.getAngle(state.action.fl)) > 4,
      trueCond: "rotateToGoal",
      falseCond: "runToGoal",
  },
  rotateToGoal: {
      exec (mgr, state) { state.command = {n: "turn", v:
              mgr.getAngle(state.action.fl)} },
      next: "sendCommand",
  },
  runToGoal: {
      exec (mgr, state) { state.command = {n: "dash", v: 80} },
      next: "sendCommand",
  },
  sendCommand: {
      command: (mgr, state) => state.command
  },
  ballSeek: {
      condition:
          (mgr, state) => 0.5 > mgr.getDistance(state.action.fl),
      trueCond: "closeBall",
      falseCond: "farGoal",
  },
  closeBall: {
      condition:
          (mgr, state) => mgr.getVisible(state.action.goal),
      trueCond: "ballGoalVisible",
      falseCond: "ballGoalInvisible",
  },
  ballGoalVisible: {
      exec (mgr, state) { state.command =
          {n: "kick", v: `70 ${mgr.getAngle(state.action.goal)}`}},
      next: "sendCommand",
  },
  ballGoalInvisible: {
      exec (mgr, state) {state.command = {n: "kick", v: "10 45"}},
      next: "sendCommand",
  },
}

const DT_pride_2 = {
  state: {
      next: 0,
      sequence: [/*{act: FL, fl: "frb"}, {act: FL, fl: "gl"},*/
          {act: KI, fl: "b", goal: "gr"}],
      command: null,
      playerDist: 0,
      playerAngle: 0,
      role: "main"
  },
  root: {
      exec(mgr, state) { state.action =
          state.sequence[state.next]; state.command = null },
      next: "seekPlayer",
  },
  seekPlayer: {
      condition: (mgr,state) => mgr.getVisiblePlayer('"teamA"', 1),
      trueCond: "init",
      falseCond: "seekAnyPlayer"
  },
  seekAnyPlayer: {
      condition: (mgr, state) => mgr.getVisiblePlayer('"teamA"'),
      trueCond: "initAnyPlayer",
      falseCond: "rotate",
  },
  sendCommand: {
      command: (mgr, state) => state.command
  },
  rotate: {
      exec (mgr, state) { state.command = {n: "turn", v: "90"} },
      next: "sendCommand",
  },
  init: {
      exec(mgr,state) {state.playerDist = mgr.getPlayerDist('"teamA"', 1); state.playerAngle = mgr.getPLayerAngle('"teamA"', 1)},
      next: "playerClose",
  },
  initAnyPlayer: {
      exec(mgr,state) {state.playerDist = mgr.getPlayerDist('"teamA"'); state.playerAngle = mgr.getPLayerAngle('"teamA"')},
      next: "playerClose",
  },
  playerClose: {
      condition: (mgr,state) => state.playerDist < 1 && Math.abs(state.playerAngle) < 40,
      trueCond: "turn30",
      falseCond: "playerFar",
  },

  playerFar: {
      condition: (mgr, state) => state.playerDist > 10,
      trueCond: "farAngleCheck",
      falseCond: "closeAngleCheck",
  },
  farAngleCheck: {
      condition: (mgr, state) => Math.abs(state.playerAngle) > 50,
      trueCond: "turnPlayer",
      falseCond: "dash100",
  },
  closeAngleCheck: {
      condition: (mgr,state) => state.playerAngle > 40 || state.playerAngle < 25,
      trueCond: "turnMin30",
      falseCond: "distCheck",
  },
  distCheck: {
      condition: (mgr, state) => state.playerDist < 7,
      trueCond: "dash40",
      falseCond: "dash80"
  },
  turnPlayer: {
      exec(msg, state) {state.command = {n: "turn", v: state.playerAngle}},
      next: "sendCommand",
  },
  dash80: {
      exec(msg, state) {state.command = {n: "dash", v: 80}},
      next: "sendCommand"
  },
  dash100: {
      exec(msg, state) {state.command = {n: "dash", v: 100}},
      next: "sendCommand"
  },
  dash40: {
      exec(msg, state) {state.command = {n: "dash", v: 40}},
      next: "sendCommand"
  },
  turnMin30: {
      exec(msg, state) {state.command = {n: "turn", v: -30}},
      next: "sendCommand",
  },
  turn30: {
      exec(msg, state) {state.command = {n: "turn", v: 30}},
      next: "sendCommand",
  },
}

const DT_pride_3 = {
  state: {
      next: 0,
      sequence: [/*{act: FL, fl: "frb"}, {act: FL, fl: "gl"},*/
          {act: KI, fl: "b", goal: "gr"}],
      command: null,
      playerDist: 0,
      playerAngle: 0,
      role: "main"
  },
  root: {
      exec(mgr, state) { state.action =
          state.sequence[state.next]; state.command = null },
      next: "seekPlayer",
  },
  seekPlayer: {
      condition: (mgr,state) => mgr.getVisiblePlayer('"teamA"', 1),
      trueCond: "init",
      falseCond: "seekAnyPlayer"
  },
  seekAnyPlayer: {
      condition: (mgr, state) => mgr.getVisiblePlayer('"teamA"'),
      trueCond: "initAnyPlayer",
      falseCond: "rotate",
  },
  sendCommand: {
      command: (mgr, state) => state.command
  },
  rotate: {
      exec (mgr, state) { state.command = {n: "turn", v: "90"} },
      next: "sendCommand",
  },
  init: {
      exec(mgr,state) {state.playerDist = mgr.getPlayerDist('"teamA"', 1); state.playerAngle = mgr.getPLayerAngle('"teamA"', 1)},
      next: "playerClose",
  },
  initAnyPlayer: {
      exec(mgr,state) {state.playerDist = mgr.getPlayerDist('"teamA"'); state.playerAngle = mgr.getPLayerAngle('"teamA"')},
      next: "playerClose",
  },
  playerClose: {
      condition: (mgr,state) => state.playerDist < 1 && Math.abs(state.playerAngle) < 40,
      trueCond: "turnMin30",
      falseCond: "playerFar",
  },

  playerFar: {
      condition: (mgr, state) => state.playerDist > 10,
      trueCond: "farAngleCheck",
      falseCond: "closeAngleCheck",
  },
  farAngleCheck: {
      condition: (mgr, state) => Math.abs(state.playerAngle) > 50,
      trueCond: "turnPlayer",
      falseCond: "dash100",
  },
  closeAngleCheck: {
      condition: (mgr,state) => state.playerAngle < -40 || state.playerAngle > -25,
      trueCond: "turn30",
      falseCond: "distCheck",
  },
  distCheck: {
      condition: (mgr, state) => state.playerDist < 7,
      trueCond: "dash40",
      falseCond: "dash80"
  },
  turnPlayer: {
      exec(msg, state) {state.command = {n: "turn", v: state.playerAngle}},
      next: "sendCommand",
  },
  dash80: {
      exec(msg, state) {state.command = {n: "dash", v: 80}},
      next: "sendCommand"
  },
  dash100: {
      exec(msg, state) {state.command = {n: "dash", v: 100}},
      next: "sendCommand"
  },
  dash40: {
      exec(msg, state) {state.command = {n: "dash", v: 40}},
      next: "sendCommand"
  },
  turnMin30: {
      exec(msg, state) {state.command = {n: "turn", v: -30}},
      next: "sendCommand",
  },
  turn30: {
      exec(msg, state) {state.command = {n: "turn", v: 30}},
      next: "sendCommand",
  },
}

const DT_goalie = {
  state: {
      next: 0,
      sequence: [{act: "Goal", fl: "gr"}, {act: "Center", fl: "fprc"},
          {act: "Side", fl: "fprt"}, {act: "Side", fl: "fprb"}, {act: "Ball", fl: "b"}],
      command: null
  },
  root: {
      exec(mgr, state) { 
        console.log("State.next: ", state.next)
        state.action =
          state.sequence[state.next]; state.command = null },
      next: "ballVisible",
  },
  ballVisible: {
      condition(mgr, state){
        console.log("ballVisible")
        return (mgr.getVisible("b") && mgr.getDistance("b") < 5)
      },
      trueCond: "ballClose",
      falseCond: "goalSequence",
  },
  goalSequence: {
      condition(mgr, state){
        console.log("goalSequence")
        return state.action.act == "Goal"
    },
      trueCond: "seekGoal",
      falseCond: "centerSequence"
  },
  seekGoal: {
      condition(mgr, state){
        console.log("seekGoal")
        return mgr.getVisible(state.action.fl)
      },
      trueCond: "goalDist",
      falseCond: "rotate"
  },
  rotate: {
      exec (mgr, state) { 
        console.log("rotate")
        state.command = {n: "turn", v: "90"} 
    },
      next: "sendCommand",
  },
  goalDist: {
      condition(mgr, state){
        console.log("goalDist")
        return mgr.getDistance(state.action.fl) > 5
    },
      trueCond: "runToGoal",
      falseCond: "nextSeq"
  },
  runToGoal: {
      exec(mgr,state) {
        console.log("runToGoal")
        state.command = {n: "dash", v: `100 ${mgr.getAngle(state.action.fl)}`}
    },
      next: "sendCommand"
  },
  goToGoal: {
      exec(mgr, state) {
        console.log("goToGoal")
        state.command = {n: "dash", v: `30 ${mgr.getAngle(state.action.fl)}`}
    },
      next: "sendCommand"
  },
  sendCommand: {
      command(mgr, state){
        console.log("sendCommand")
        return state.command
    }
  },
  nextSeq: {
      exec(mgr, state) {
        console.log("nextSeq")
        state.next++; 
        state.action = state.sequence[state.next]; 
        console.log(state.next+ "!!!!!!!") },
      next: "wait",
  },
  centerSequence: {
      condition(mgr, state){
        console.log("centerSequence")
        return state.action.act == "Center"
    },
      trueCond: "seekFlag",
      falseCond: "sideSequence"
  },
  seekFlag: {
      condition(mgr,state){
        console.log("seekFlag")
        return mgr.getVisible(state.action.fl)
    },
      trueCond: "centerDist",
      falseCond: "rotate"
  },
  centerDist: {
      condition(mgr,state){
        console.log("centerDist")
        console.log(`${ mgr.getDistance(state.action.fl)}+++++++${state.action.fl}`) ;return mgr.getDistance(state.action.fl) > 12 && mgr.getDistance(state.action.fl) < 16},
      trueCond: "nextSeq",
      falseCond: "centerDistCheck",
  },
  centerDistCheck: {
      condition(mgr, state){
        console.log("centerDistCheck")
        return mgr.getDistance(state.action.fl) <= 12
    },
      trueCond: "goBack",
      falseCond: "goToGoal"
  },
  goBack: {
      exec(mgr, state) {
        console.log("goBack")
        state.command = {n: "dash", v: `-20 ${mgr.getAngle(state.action.fl)}`}},
      next: "sendCommand"
  },
  sideSequence: {
      condition(mgr,state){
        console.log("sideSequence")
        return state.action.act == "Side"},
      trueCond: "seekSide",
      falseCond: "ballSequence"
  },
  seekSide: {
      condition(mgr, state){
        console.log("seekSide")
        return mgr.getVisible(state.action.fl)
    },
      trueCond: "sideDist",
      falseCond: "rotate"
  },
  sideDist: {
      condition(mgr,state){
        console.log("sideDist")
        console.log(`${ mgr.getDistance(state.action.fl)}+++++++${state.action.fl}`) ;return mgr.getDistance(state.action.fl) > 20 && mgr.getDistance(state.action.fl) < 28},
      trueCond: "nextSeq",
      falseCond: "sideDistCheck",
  },
  sideDistCheck: {
      condition(mgr,state){
        console.log("sideDistCheck")
        return mgr.getDistance(state.action.fl) <= 20},
      trueCond: "goBack",
      falseCond: "goToGoal"
  },
  ballSequence: {
      condition(mgr,state){
        console.log("ballSequence")
        return mgr.getVisible("b")},
      trueCond: "ballDist",
      falseCond: "rotate",
  },
  ballDist: {
      condition(mgr,state){ console.log("ballDist"); return mgr.getDistance(state.action.fl) < 15},
      trueCond: "ballClose",
      falseCond: "wait"
  },
  wait: {
      exec(mgr,state) {console.log("wait");state.command = {n:"dash", v: 0}},
      next: "sendCommand"
  },
  ballClose: {
      condition(mgr, state){console.log("ballClose"); return mgr.getDistance("b") < 2},
      trueCond: "closeDist",
      falseCond: "goToBall"
  },
  closeDist: {
      condition(mgr, state){console.log("closeDist"); return mgr.getDistance("b") < 2},
      trueCond: "goalDir",
      falseCond: "catchBall"
  },
  catchBall: {
    exec(mgr,state){console.log("catchBall"); state.command = {n: "catch", v: mgr.getAngle("b")}},
    next: "sendCommand"
  },
  goToBall: {
      exec(mgr,state) {console.log("goToBall"); state.command = {n: "dash", v: `100 ${mgr.getAngle("b")}`}},
      next: "sendCommand"
  },

  goalDir: {
      condition(mgr,state){console.log("goalDir"); return mgr.getVisible("gr") == false},
      trueCond: "kickBall",
      falseCond: "rotateBall",
  },

  kickBall: {
      exec(mgr, state) {console.log("kickBall"); state.command = {n: "kick", v: `100 ${mgr.getAngle("gl")}`}},
      next: "sendCommand",
  },

  rotateBall: {
      exec (mgr, state) {console.log("rotateBall"); state.command = {n: "kick", v: "10 45"}; state.next = state.sequence.length-1},
      next: "sendCommand",
  }
}

module.exports = {DT_goalie, DT_pride, DT_pride_2, DT_pride_3}