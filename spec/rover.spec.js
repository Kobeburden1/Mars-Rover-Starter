const Rover = require('../rover.js');
const Message = require('../message.js');
const Command = require('../command.js');

// NOTE: If at any time, you want to focus on the output from a single test, feel free to comment out all the others.
//       However, do NOT edit the grading tests for any reason and make sure to un-comment out your code to get the autograder to pass.


describe("Rover class", function() {
  
  test ("constructor sets position and default values for mode and generatorWatts", function(){
  let rover = new Rover(15)
  expect(rover.position).toBe(15)
  expect(rover.mode).toBe('NORMAL')
  expect(rover.generatorWatts).toBe(110)
})

test ("response returned by receiveMessage contains the name of the message", function(){
  let message = new Message("Message")
  let rover = new Rover(996547)
  let response = rover.receiveMessage(message)
  expect(response.message).toBe("Message")
})

test ("response returned by receiveMessage includes two results if two commands are sent in the message", function(){
  let commands = [
    new Command("MODE_CHANGE", "LOW_POWER"),
    new Command("STATUS_CHECK")
  ];

  let message = new Message("message", commands);
  let rover = new Rover(5616698);
  let response = rover.receiveMessage(message);
  expect(response.results.length).toEqual(commands.length)
})

test ("responds correctly to the status check command",function(){
  let commands = [new Command('STATUS_CHECK')];
  let message = new Message('Message', commands);
  let rover = new Rover(10);
  let response = rover.receiveMessage(message);

  expect(response.results[0]).toHaveProperty("roverStatus");
  expect(response.results[0].roverStatus.mode).toBe('NORMAL');
  expect(response.results[0].roverStatus.generatorWatts).toBe(110);
  expect(response.results[0].roverStatus.position).toBe(10)
})

test ("responds correctly to the mode change command", () => {
  const commands = [new Command("MODE_CHANGE", "LOW_POWER")];
  const message = new Message("Test mode change command", commands);

  const rover = new Rover(10);
  const response = rover.receiveMessage(message);

  expect(response.results[0].completed).toBe(true);

  expect(rover.mode).toBe("LOW_POWER");
});

test ("responds with a false completed value when attempting to move in LOW_POWER mode", function(){
  let commands = [new Command('MOVE', 'LOW_POWER')];
  let message = new Message("Message", commands);
  let rover = new Rover(156)
  rover.receiveMessage(new Message("Change mode to LOW_POWER", [new Command('MODE_CHANGE', 'LOW_POWER')]))

  let response = rover.receiveMessage(message);
  expect(response.results[0].completed).toBe(false)
  expect(rover.position).toEqual(156)
  
})

test ("responds with the position for the move command", function(){
  let commands= [new Command('MOVE', 511889)]
  let message = new Message("MOVE", commands)
  let rover = new Rover(550)
  let response = rover.receiveMessage(message)
  expect(response.results[0].completed).toBe(true)
  expect(rover.position).toEqual(511889)
})
})
  // 7 tests here;
