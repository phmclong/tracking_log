const DB_HOST = process.env.DB_HOST;
const DB_PORT = process.env.DB_PORT;
const DB_DATABASE = process.env.DB_DATABASE;

module.exports = {
   uri: 'mongodb://' + DB_HOST + ':' + DB_PORT + '/' + DB_DATABASE,
   // uri: 'mongodb://127.0.0.1:27017/Box',
   //option login
   options : {
      autoIndex: false, // Don't build indexes
      
      socketTimeoutMS: 60000,
      serverSelectionTimeoutMS: 5000,
   //  user: 'quynhnm',
   //  pass: 'quynhnm'
   }
}
