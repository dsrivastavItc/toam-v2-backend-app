//require('dotenv').config();
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
   const conn= await mongoose.connect(
        //process.env.MONGO_URI
        "mongodb://127.0.0.1:27017/user"
      //   "mongodb+srv://deepak_sri:LNYjQlSWT8JymAk2@cluster-mongo-db.fnl4vzi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster-mongo-db"
      //   ,{
      //       'dbName': 'obstacles'
      //      }
        );
       
       console.log('MongoDB connected');
     return conn; 
  } catch (err) {
    console.error(err);
    //process.exit(1);
  }
  return null;
};

module.exports = connectDB;
