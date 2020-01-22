const mongoose = require('mongoose');
const config = require('config');
const db_url = config.get('mongoURI');

const connectDB = async () => {
  try{
    await mongoose.connect(db_url, {
      useNewUrlParser: true,
      useUnifiedTopology: true      
    });
    console.log(`Database connected...`);
  }catch(error){
    console.error(error);
    process.exit(1);  
  }
}

module.exports = connectDB;