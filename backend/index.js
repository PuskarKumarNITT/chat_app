const express = require("express");
const cors = require("cors");
const connectDB = require("./config/connectDB");
require('dotenv').config();
const router = require('./routes/index');
const cookiesParser = require("cookie-parser");
const {app, server}  = require("./socket/index");


// const app = express();
const PORT = process.env.PORT || 8080;


app.use(cors({
    origin: [process.env.FRONTEND_URL,"https://chatappfrontend-p2j0.onrender.com"],  // <-- this reads from your .env
    credentials: true
}));

console.log(process.env.FRONTEND_URL);

app.use(express.json());
app.use(cookiesParser());


app.get("/",(req,res) => {
    res.json({
        message: "Server is running at port "+ PORT
    })
})

// api endpoints
app.use('/api',router);

connectDB().then(() => {
    server.listen(PORT,() => {
    console.log(`server is running at port ${PORT}`);
    })
})
.catch((err) => {
    console.log(`error in connection` , err.message);
})
