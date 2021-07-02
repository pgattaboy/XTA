const express = require("express") ;
const bodyParser = require("body-parser");

const app = express();

//to use public folder
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));//This is important for bodyparsing .

app.get("/",function(req,res){

    res.sendFile(__dirname + "/public/html/index.html");
});

app.get("/signup",function(req,res){
    res.sendFile(__dirname + "/public/html/signup.html");
});

app.get("/signin",function(req,res){
    res.sendFile(__dirname + "/public/html/signin.html");
});

app.get("/sellpost",function(req,res){
    res.sendFile(__dirname + "/public/html/sellpost.html");
});

app.post("/login",function(req,res){
    
    console.log(req.body.email);
    console.log(req.body.password);

    //incase the user exist in the databasae and password matches
    //res.sendFile(__dirname + "/public/html/index.html");
});

app.post("/signupform",function(req,res){
    console.log(req.body.fname);
    console.log(req.body.lname);
    console.log(req.body.gender);
    console.log(req.body.dob);
    console.log(req.body.roll);
    console.log(req.body.email);

    //incase the user exist in the databasae and password matches
    //res.sendFile(__dirname + "/public/html/index.html");
});

app.post("/post",function(req,res){
    console.log("Request Recieved!");
    console.log(req.body.product_type);
});

app.listen("5500",function(){
    console.log("The server is up and running on PORT 5500");
});