const Agent = require('./agent')
const socket = require('./socket')

teamA = 'CHE'
teamB = 'EHC'

coords = [
    [-10, 0],
    [-5, -5],
    [-5, 5], 
    [-25, -3], 
    [-25, 3], 
    [-25, -15],
    [-25, 15], 
    [-35, -25],
    [-35, 0], 
    [-35, 25]
]

// team1
for (let i = 0; i < coords.length; ++i)
{
    let agent = new Agent(teamA, "unknown");
    socket(agent.bridge)
    agent.bridge.connect(teamA, 7, 'unknown')
    agent.controls.Move(coords[i][0], coords[i][1]);
}
// goalie 1
let agent = new Agent(teamA, "goalie");
socket(agent.bridge)
agent.bridge.connect(teamA, 7, 'goalie')
agent.controls.Move(-50, 0);


// team2
for (let i = 0; i < coords.length; ++i)
{
    let agent = new Agent(teamB, "unknown");
    socket(agent.bridge)
    agent.bridge.connect(teamB, 7, 'unknown')
    agent.controls.Move(coords[i][0], coords[i][1]);
}
// goalie 2
let agent2 = new Agent(teamB, "goalie");
socket(agent2.bridge)
agent2.bridge.connect(teamB, 7, 'goalie')
agent2.controls.Move(-50, 0);
