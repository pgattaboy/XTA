const express = require("express") 
const dotenv = require("dotenv")
const path = require('path')
const handelBars = require("hbs")
const mysql = require("mysql")
const cookieParser = require("cookie-parser")
const fs = require('fs')

//as .env store secret info of database we need to create it first
dotenv.config({ path: './.env' });

const app = express();

//we create connection with 'xta' database
//env store sensitive infromation 
const db = mysql.createConnection({
    host: process.env.db_host,
    user:process.env.db_user,
    password: process.env.db_password,
    database: process.env.db,
});

//to use public folder 
const publicDirectory = path.join(__dirname , './public');
app.use(express.static(publicDirectory));

//what kind of engine to show html template
app.set('view engine', 'hbs');

//we are connecting with data basae
db.connect((error)=>{
    if(error){
        console.log(error);//if anything wrong happened it will print error.
    }
    else{
        console.log("MySQL is connected...");
    }
});

//secure bodyParsing
//extended true--use qs library which allow any kind of dataset as object value
//extended false--use querystring library which only allow to use string and array as object value
app.use(express.urlencoded({extended:true}));


//the value coming from form or API must be in JSON form
app.use(express.json())

//always after express.json
app.use(cookieParser())


//defining all the routes in pages.js
app.use('/',require('./routes/pages'))
app.use('/auth',require('./routes/auth'))


app.listen("5500",function(){
    console.log("The server is up and running on PORT 5500")
});