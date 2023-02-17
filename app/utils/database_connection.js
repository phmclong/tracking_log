const dbConfig = require('../config/db');

var mongoose = require('mongoose');


  

const open = () => {
    mongoose.Promise = global.Promise
    mongoose.connect(dbConfig.uri, dbConfig.options)

    mongoose.connection.on('connected', function () {
        console.log('Mongoose connection success');
    }); 
    
    mongoose.connection.on('error',function (err) { 
        console.log('Mongoose connection error: ' + err);
    }); 
    
    mongoose.connection.on('disconnected', function () { 
        console.log('Mongoose connection disconnected'); 
    });
    
    // If the Node process ends, close the Mongoose connection 
    process.on('SIGINT', function() {   
        mongoose.connection.close(function () { 
            console.log('Mongoose connection disconnected through app termination'); 
            process.exit(0); 
        }); 
    }); 
}

module.exports = {
    open
}
