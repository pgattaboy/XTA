const express = require('express')
const authController = require('../controller/auth');
const { route } = require('./auth');

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
router.get("/",authController.isLoggedIn,authController.getPost)
//
//post homepage
//
router.post("/",authController.isLoggedIn,authController.getPost)
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
//
//searching items ,doesnot need to sign in
//
router.get("/search",authController.isLoggedIn,authController.searchPost)

//
//going to chat pages which hold all the rooms
// 
router.post("/chatroom", authController.isLoggedIn, authController.getRoom)

//
//add user to specific chatroom
//
router.get("/addchatroom",authController.isLoggedIn,authController.addUser,authController.getRoom)
//we are exporting router module to require in app.js
module.exports = router;