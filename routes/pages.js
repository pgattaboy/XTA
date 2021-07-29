const express = require('express')
const authController = require('../controller/auth')

const router = express.Router()

router.get("/signup",(req,res)=>{
    res.render('signup')
});

router.get("/signin",(req,res)=>{
    res.render('signin')
});

router.get("/profile", authController.isLoggedIn , (req,res)=>{
    //first we will check wether the user is logged IN
    //if the user is logged in the req.user will carry the correct value
    //console.log(req.user);
    if(req.user){
        res.render('profile',{
            user: req.user,
        })

    }
    else{
        res.redirect('/signin')
    }
})

router.get("/",authController.isLoggedIn,(req,res)=>{
    if(req.user){
        res.render('index',{
            user:req.user,
        })
    }
    else
    res.render('index')
})

router.post("/",authController.isLoggedIn,(req,res)=>{
    if(req.user){
        res.render('index',{
            user:req.user,
        })
    }
    else
    res.render('index')
});

router.get("/updateprofile",authController.isLoggedIn,(req,res)=>{
    if(req.user){
        res.render('updateprofile',{
            user:req.user,
        })
    }
    else
    res.render('signin')
})

router.get("/sellpost",authController.isLoggedIn,(req,res)=>{
    if(req.user){
        res.render('sellpost',{
            user:req.user,
        })
    }
    else
    res.render('signin')
});

//we are exporting router module to require in app.js
module.exports = router;