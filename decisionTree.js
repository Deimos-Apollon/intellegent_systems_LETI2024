const FL = "flag"
const KI = "kick"

const DT_TeamA1 = {
    state: {
        next: 0,
        sequence: [{act: "start"},
            {act: KI, fl: "b", goal: '"teamA"'}, {act: "say", info: "go"}, {act: "wait", fl: "fplc"}, {act: "return"}],
        command: null,
        role: "main"
    },
    root: {
        exec(mgr, state) { state.action =
            state.sequence[state.next]; state.command = null },
        next: "rootStart",
    },
    rootStart: {
        condition: (mgr, state) => state.action.act == "start",
        trueCond: "hearPlayOn",
        falseCond: "rootFlag",
    },
    hearPlayOn: {
        condition: (mgr, state) => mgr.hear( "play_on"),
        trueCond: "next",
        falseCond: "wait",
    },
    wait: {
        exec(mgr,state) {state.command = {n: "dash", v: "0"}},
        next: "sendCommand"
    },
    rotate: {
        exec (mgr, state) { state.command = {n: "turn", v: "90"} },
        next: "sendCommand",
    },
    rootFlag: {
        condition: (mgr, state) => state.action.act == FL,
        trueCond: "flagSeek",
        falseCond: "rootBall",
    },
    rootBall: {
        condition: (mgr, state) => state.action.act == KI,
        trueCond: "ballSeek",
        falseCond: "rootSay"
    },
    rootSay: {
      condition: (mgr, state) => state.action.act == "say",
      trueCond: "sayGo",
      falseCond: "rootWait",
    },
    rootWait: {
        condition: (mgr, state) => state.action.act == "wait",
        trueCond: "waitResolve",
        falseCond: "rootReturn"
    },
    rootReturn: {
        exec(mgr, state) {state.command = {n: "move", v: "-10 0"};
        state.next = 0;},
        next: "sendCommand"
    },
    waitResolve: {
        condition: (mgr,state) => mgr.hear("goal_"),
        trueCond: "next",
        falseCond: "flagSeek"
    },
    flagSeek: {
        condition: (mgr, state) => mgr.getVisible(state.action.fl),
        trueCond: "flagDist",
        falseCond: "rotate",
    },
    flagDist: {
        condition: (mgr, state) => 3 >
            mgr.getDistance(state.action.fl),
        trueCond: "closeFlag",
        falseCond: "farGoal",
    },
    closeFlag: {
        condition: (mgr, state) => state.action.act == "wait",
        trueCond: "wait",
        falseCond: "next"
    },
    next: {
        exec(mgr, state)
        {state.next++; state.action = state.sequence[state.next]},
        next: "root",
    },
    sayGo: {
        exec(mgr,state) {state.command = {n: "say", v: "go"}; state.next++; state.action = state.sequence[state.next]},
        next: "sendCommand",
    },
    farGoal: {
        condition:
            (mgr, state) => mgr.getAngle(state.action.fl) != 0,
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
            (mgr, state) => mgr.getVisible(state.action.fl),
        trueCond: "ballDist",
        falseCond: "rotate",
    },
    ballDist: {
        condition:
            (mgr, state) => 0.5 > mgr.getDistance(state.action.fl),
        trueCond: "closeBall",
        falseCond: "farGoal",
    },
    closeBall: {
        condition:
            (mgr, state) => mgr.getVisiblePlayer(state.action.goal) !== false,
        trueCond: "ballGoalVisible",
        falseCond: "ballGoalInvisible",
    },
    ballGoalVisible: {
        exec (mgr, state) {
           console.log(mgr.getPLayerAngle(state.action.goal));
          state.command =
            {n: "kick", v: `65 ${mgr.getPLayerAngle(state.action.goal) -10}`}; state.next++; state.action = state.sequence[state.next]},
        next: "sendCommand",
    },
    ballGoalInvisible: {
        exec (mgr, state) {state.command = {n: "kick", v: "10 45"}},
        next: "sendCommand",
    },
}
  
const DT_TeamA2 = {
    state: {
        next: 0,
        sequence: [{act: "start"}, {act: "wait", fl: "fgrb", cmd: "go", source: '"teamA"'},{act: KI, fl: "b", goal: "gr"}, {act: "return"}],
        command: null,
        role: "main"
    },
    root: {
        exec(mgr, state) { state.action =
            state.sequence[state.next]; state.command = null },
        next: "rootStart",
    },
    rootStart: {
        condition: (mgr, state) => state.action.act == "start",
        trueCond: "hearPlayOn",
        falseCond: "rootFlag",
    },
    hearPlayOn: {
        condition: (mgr, state) => mgr.hear("play_on"),
        trueCond: "next",
        falseCond: "wait",
    },
    wait: {
        exec(mgr,state) {state.command = {n: "dash", v: "0"}},
        next: "sendCommand"
    },
    rotate: {
        exec (mgr, state) { state.command = {n: "turn", v: "90"} },
        next: "sendCommand",
    },
    rootFlag: {
        condition: (mgr, state) => state.action.act == FL,
        trueCond: "flagSeek",
        falseCond: "rootBall",
    },
    rootBall: {
        condition: (mgr, state) => state.action.act == KI,
        trueCond: "ballCmd",
        falseCond: "rootWait"
    },
  
    rootWait: {
        condition: (mgr, state) => state.action.act == "wait",
        trueCond: "waitResolve",
        falseCond: "rootSeek"
    },
    rootSeek: {
        condition: (mgr, state) => state.action.act == "seek",
        trueCond: "seekResolve",
        falseCond: "rootReturn"
    },
    seekResolve: {
        condition: (mgr, state) => mgr.getVisible("b"),
        trueCond: "next",
        falseCond: "runToFlag",
    },
    runToFlag: {
        condition: (mgr, state) => mgr.getVisible(state.action.fl),
        trueCond: "runToGoal",
        falseCond: "rotate",
    },
    rootReturn: {
        exec(mgr, state) {state.command = {n: "move", v: `-20 20` }; console.log(state.command); state.next = 0;},
        next: "sendCommand"
    },
    waitResolve: {
        condition: (mgr,state) => mgr.hear(state.action.cmd),
        trueCond: "next",
        falseCond: "flagSeek"
    },
    flagSeek: {
        condition: (mgr, state) => mgr.getVisible(state.action.fl),
        trueCond: "flagDist",
        falseCond: "rotate",
    },
    flagDist: {
        condition: (mgr, state) => 10 >
            mgr.getDistance(state.action.fl),
        trueCond: "closeFlag",
        falseCond: "farGoal",
    },
    closeFlag: {
        condition: (mgr, state) => state.action.act == "wait",
        trueCond: "wait",
        falseCond: "next"
    },
    next: {
        exec(mgr, state)
        {state.next++; state.action = state.sequence[state.next]},
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
        exec (mgr, state) { state.command = {n: "dash", v: `80 ${mgr.getAngle(state.action.fl)}`} },
        next: "sendCommand",
    },
    sendCommand: {
        command: (mgr, state) => state.command
    },
    ballCmd: {
        condition:
            (mgr, state) => mgr.hear( "goal_"),
        trueCond: "next",
        falseCond: "ballSeek",
    },
    ballSeek: {
        condition:
            (mgr, state) => mgr.getVisible(state.action.fl),
        trueCond: "ballDist",
        falseCond: "rotate",
    },
    ballDist: {
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
            {n: "kick", v: `100 ${mgr.getAngle(state.action.goal)}`}},
        next: "sendCommand",
    },
    ballGoalInvisible: {
        exec (mgr, state) {state.command = {n: "kick", v: "10 45"}},
        next: "sendCommand",
    },
}
  
const DT_TeamB = {
    state: {
        next: 0,
        sequence: [{act: "start"},{act: FL, fl: "fplb"}, {act: "wait", fl: "fgrb", cmd: "go", source: "teamA"}, {act: "seek", fl: "fgrb"}, {act: KI, fl: "b", goal: "gr"}, {act: "return"}],
        command: null,
        role: "main"
    },
    root: {
        exec(mgr, state) { state.action =
            state.sequence[state.next]; state.command = null },
        next: "rootStart",
    },
    rootStart: {
        exec (mgr,state) {state.command = {n: "dash", v: 0}},
        next: "sendCommand",
    },
    sendCommand: {
        command: (mgr, state) => state.command
    },
}

module.exports = {DT_TeamA1, DT_TeamA2, DT_TeamB}