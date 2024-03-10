const Message = require("./message");
const Command = require("./command");
class Rover {
   constructor(position, generatorWatts = 110){
      this.position = position
      this.mode = 'NORMAL';
      this.generatorWatts = generatorWatts;
   }
   
   receiveMessage(message){
      let results = [];
      for(const command of message.commands){
         try{
            const result = this.executeCommand(command);
            results.push(result)
         }catch(error){
            results.push({completed: false, error: error.message});
         }
      }return {
         message: message.name,
         results: results
      };
   }

   executeCommand(command){
      try{
         if(command.commandType === 'MOVE'){
            return this.moveCommandExecution(command);
         }else if(command.commandType === 'STATUS_CHECK'){
            return this.statusCheckCommand();
         }else if(command.commandType === 'MODE_CHANGE'){
            return this.modeChangeCommand(command);
         }else{
            throw new Error('Invalid Command')
         }
      }catch(error){
         throw new Error(`${command.commandType} command was unable to execute. ${error.message}`)
      }
   }

   moveCommandExecution(command){
      if(this.mode === 'LOW_POWER'){
         throw new Error('In mode "LOW_POWER", execution failed.')
      }
      this.position = command.value;
      return{completed: true}
   }
   statusCheckCommand(){
    return {
         completed: true,
       roverStatus: {
            mode: this.mode,
            generatorWatts: this.generatorWatts,
            position: this.position
         }
      }
   }
   modeChangeCommand(command){
      this.mode = command.value;
      return{completed: true}
   }
   // Write code here!
}

module.exports = Rover;