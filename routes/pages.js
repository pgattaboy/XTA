const express = require('express')
const authController = require('../controller/auth')

const router = express.Router()

router.get("/signup",(req,res)=>{
    res.render('signup')
});

router.get("/signin",(req,res)=>{
    res.render('signin')
});
//
//get homepage
//
router.get("/",authController.isLoggedIn,(req,res)=>{
    if(req.user){
        res.render('index',{
            user:req.user,
        })
    }
    else
    res.render('index')
})
//
//post homepage
//
router.post("/",authController.isLoggedIn,(req,res)=>{
    if(req.user){
        res.render('index',{
            user:req.user,
        })
    }
    else
    res.render('index')
});
//
//get update profile page
//
router.get("/updateprofile",authController.isLoggedIn,(req,res)=>{
    if(req.user){
        res.render('updateprofile',{
            user:req.user,
        })
    }
    else
    res.render('signin')
})
//
//get sellpost page
//
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