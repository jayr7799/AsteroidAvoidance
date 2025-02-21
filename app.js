const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const bodyParser = require("body-parser");
const path = require("path");
const Player = require("./models/player");

const app = express();
const port = 5000;

app.use(express.static(path.join(__dirname, "public")));

app.use(bodyParser.json());
app.use(express.urlencoded({extended:true}));

mongoose.connect("mongodb://localhost:27017/AsteroidScores")
const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB Connection Error"));
db.once("open", ()=>{console.log("Connected to MongoDB database")});

app.get("/", (req, res)=> {res.sendFile("")});

app.post("/addScore", async(req,res)=>{
    try{
        const newHighScore = new Player({
            name:req.body.name,
            score:req.body.score
        });
        const saveScore = await newHighScore.save();
        console.log(saveScore)
    }
    catch(error){
        res.status(501).json({error:"Failed to add new HighScore"})
    }
});

app.get("/highScores", async(req,res)=>{
    try{
        const score = await Player.find();
        res.json(score);
    }
    catch(err)
    {
        res.status(500).json({error:"Failed to get scores from database"});
    }
})

app.listen(port, ()=>{
    console.log(`Running on port ${port}!`);
})

