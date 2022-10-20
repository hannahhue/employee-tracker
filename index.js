//defining assets being used
const mysql = require("mysql2");
const { startPrompts } = require("./assets/js/functions");

function init() {
  console.log(`
                                                                     
   _____           _                    _____             _           
  |   __|_____ ___| |___ _ _ ___ ___   |_   _|___ ___ ___| |_ ___ ___ 
  |   __|     | . | | . | | | -_| -_|    | | |  _| .'|  _| '_| -_|  _|
  |_____|_|_|_|  _|_|___|_  |___|___|    |_| |_| |__,|___|_,_|___|_|  
              |_|       |___|                                 
              
  `);

  startPrompts();
}

init();
