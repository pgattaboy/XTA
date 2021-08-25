const express = require("express") 
const dotenv = require("dotenv")
const path = require('path')
const handelBars = require("hbs")
const mysql = require("mysql")
const cookieParser = require("cookie-parser")
const fs = require('fs')
const http = require('http')
const socketio = require('socket.io')
const util = require('./util/message')
const {getCurrentUser} = require('./util/user')
const { log } = require("console")



//as .env store secret info of database we need to create it first
dotenv.config({ path: './.env' });

const app = express();

let server = http.createServer(app)
const io = socketio(server)

const PORT = process.env.PORT || 5500

//we create connection with 'xta' database
//env store sensitive infromation 
const db = mysql.createConnection({
    host: process.env.db_host,
    user: process.env.db_user,
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



//
//socket
//
const socketUsers=[]
const botName = "xtaBot"

io.on('connection',(socket)=>{
    //join new room
    socket.on("joinRoom",({room,hostRoll,username,userroll})=>{
        //creating an object
        const user = {
            id: socket.id,
            room,hostRoll,username,userroll
        }
        socketUsers.push(user)
        //socket.leave(room_id)
        socket.join(user.room)
        console.log("New socket connection .....");
        //
        //need to add database code to show previous message of room
        //
        let sql = 'SELECT id,host,sender,senderRoll,sendingtime,message FROM messages WHERE id = ? ORDER BY sendingtime'
        let data = [user.room]
        let today = new Date();
        let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        let time = today.getHours() + ":" + today.getMinutes();
        let dateTime = date+' '+time;
        db.query(sql,data,(error,result)=>{
            if(error){
                throw error
            }
            else{
                let element
                for (let i = 0; i < result.length; i++) {
                    element = result[i];
                    socket.emit('message',element)
                }
                bots = {
                    id : user.room,
                    sender : botName,
                    msg: 'Wellcome to chatbox '+user.room,
                    sendingtime: dateTime
                }
                
                // to only the user
                socket.emit('botmessage', bots)
            }
        })
        

        bot={
            id : user.room,
            sender : botName,
            msg : `${user.userroll}_${user.username} has Joined the chat room ${user.room}`,
            sendingtime: dateTime
        }
        //broadcast when a user connects to inform other users not the new user in that room
        socket.broadcast.to(user.room).emit('botmessage',bot)
    })

    //
    //listen for chatmessage
    //
        socket.on('chatmessage',({room,hostRoll,username,userroll,msg})=>{
            //let user = util.formatMessage({room,hostRoll,username,userroll,msg})
            let today = new Date();
            let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
            let time = today.getHours() + ":" + today.getMinutes() ;
            let dateTime = date+' '+time;

            const user = { id: room, host: hostRoll,sender: username,senderRoll: userroll,sendingtime: dateTime, message: msg}
            io.to(room).emit('message',user)
            console.log(user);
            //console.log(socket.rooms);
            let sql = 'INSERT INTO messages SET ?'
            db.query(sql,user, ( error ,result)=>{
                if(error) throw error
                else{
                    console.log('Stored');
                }
            })
        })
    socket.on('leave',(room)=>{
        socket.leave(room)
        const index = socketUsers.findIndex(user => user.id === socket.id);
        if(index !== -1){
            console.log('i am deleting previous rooms')
            socketUsers.splice(index, 1)[0];
        }
    })
})

server.listen(PORT,()=>{
    console.log(`The server is up and running on PORT ${PORT}`)
});