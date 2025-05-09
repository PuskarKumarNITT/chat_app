const mongoose = require("mongoose");

async function connectDB(){
    try{
        await mongoose.connect(process.env.MONGODB_URI);
        const connection = mongoose.connection;
        connection.on('connected', () => {
            console.log(`connected to database`);
        })
        connection.on('error',(error) => {
            console.log("Something went wrong in mongoDB ",error.message);
        })

    } catch(err) {
        console.log(`Something went wrong in connecting with database: ${err}`);
    }
}

module.exports = connectDB;