const express = require('express')
const authController = require('../controller/auth')

const router = express.Router()

router.post('/signupform',authController.signup)

router.post("/login",authController.login)

//first calling middleware to have user roll mto embedded that in user picture address 
//after that we are calling the upload function to upload the picture
//then we calling to save that data to store in database and reload the profile picture
router.post("/updateform", authController.isLoggedIn, profileUpload.single("prfilepicture") , authController.updateData)

router.get("/signout",authController.signOut)

router.post("/post", authController.isLoggedIn, productUpload.array("picture",2) ,authController.createPost)

module.exports = router