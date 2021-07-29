const mysql = require("mysql")
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const {promisify} = require('util')
const multer =require('multer')
const path = require('path')


const db = mysql.createConnection({
    host: process.env.db_host,
    user:process.env.db_user,
    password: process.env.db_password,
    database: process.env.db,
})


exports.signup = (req,res)=>{
    console.log("Sign UP successfull");
    const{ fname,lname,dob,gender,email,password,passwordRepeat,roll,location } = req.body
    db.query(" SELECT roll FROM user WHERE roll = ? ", [roll], async function(error,result){
        if(error){
            console.log(error)
        }
        //if result array has length means it has already an user
        if(result.length > 0){
            return res.render('signup',{
                message: "That roll has been used already"
            })
        }
        else if(password !=passwordRepeat){
            return res.render('signup',{
                message: 'Passwords do not match!!!'
            })
        }

        //as we handle all errors now we send the data into database
        //hashing the password
        let hashedPassword = await bcrypt.hash(password, 8)
        db.query('INSERT INTO user SET ?',{roll: roll,fname: fname,lname: lname,dob: dob,gender: gender,email: email,password: hashedPassword,location: location,profile_picture: "../images/uploaded/profile/avatar.png"},(error,result)=>{
            if(error){
                console.log(error)
            }
            else{
                console.log(result)
                return res.render('signin',{
                    message: 'User Registered.'
                });

            }
        });
    }) ;
};

exports.login = async (req,res)=>{
    try{
        const {roll,password} = req.body
        //console.log(req.body)
        if(!roll || !password){
            return res.status(400).render('signin',{
                message:'Please Provide all the information'
            });
        }

        db.query('SELECT * FROM user WHERE roll = ?',[roll], async (error,result)=>{
            console.log(result);
            if( !result || !(await bcrypt.compare(password, result[0].password)) ){
                return res.status(401).render('signin',{
                    message:'Your Student Id or Password is INCORRECT'
                });
            }
            else{
                console.log("You are successfully Log in!!!")

                //getting the id of the logged in user to create token and drop cookie
                const roll=result[0].roll;
                
                //creating token
                //sign()-- a jwt method that takes payload
                //sign({object-'creating token for individual user roll'}, SECRET_PASSWORD, {object-'Token expires time'})
                //
                const token= jwt.sign({roll: roll},process.env.JWT_SECRET,{
                    expiresIn: process.env.JWT_EXPIRES_IN
                });
                console.log("The token is" + token)
                //
                //creating cookie
                //giving additional option in cookie as object
                const cookieOptions = {
                    expires: new Date(
                        Date.now() + process.env.JWT_COOKIE_EXPIRES *24*60*60*1000 //taking time in milisecond
                    ),
                    httpOnly: true //setting cookie in http only browser method
                }
                res.cookie('xtacookie',token,cookieOptions); //setting up our cookie in the browser
                res.status(200).redirect("/")
            }
        });
    }
    catch(error){
        console.log(error)
    }
};

//isLoggedIn a middelware so we have to use next() as third parameter to instruct the thread to continue next operation
exports.isLoggedIn = async (req, res, next)=>{
    // console.log(req.cookies);
    if(req.cookies.xtacookie){
        try {
            //step-1: verify the token and get the user
            const decoded = await promisify(jwt.verify)(req.cookies.xtacookie,process.env.JWT_SECRET)
            console.log(decoded);
            //
            //step-2: if the user still exist
            db.query('SELECT * FROM user where roll = ?',[decoded.roll],(error,result)=>{
                if(!result){
                    return next()
                }
                req.user = result[0]
                return next()
            })
        } catch (error) {
            return next()
        }
    }
    //after working middleware, i have to call for next() to go to the next activity
    else{
        next()
    }
}
//
//first we need to upload data in the server then store that address in the database
//to do that we use global variable that had been defined by global function(important)
//
global.profileStorage = multer.diskStorage({
    destination: (req,file,cb)=>{
        cb(null,"public")
    },
    filename:(req,file,cb)=>{
        let pathUrl = "/images/uploaded/profile/"+ req.user.roll +"_"+Date.now() +"_"+file.fieldname+ path.extname(file.originalname)
        cb(null,pathUrl)
    }
})

global.profileUpload = multer({storage: profileStorage})

exports.updateData = async (req,res,err)=>{
    //req.user gave database data req.body gave form data
    //
    //console.log(req.file);
    try {
        if(!(await bcrypt.compare(req.body.password,req.user.password)) ){
            return res.status(401).render('updateprofile',{
                message:'Enter the correct PASSWORD to save changes!!!'
            });
        }
        else{
            //first we need to upload picture to the server then use the url to send database 
            if(!req.file || err instanceof multer.MulterError)
            {
                db.query('UPDATE user SET ? WHERE roll = ?',[{fname: req.body.fname, lname: req.body.lname, dob: req.body.dob,email: req.body.email, location: req.body.location },req.user.roll],
                (error,result)=>{
                    if(error) throw error
                    else{
                        console.log(result);
                        res.redirect("/profile",{
                            message: "You didn't add new profile picture."
                        })
                    }
                })
            }
            else
            {
                let pPath = req.file.path.replace("public","..")
                //let ppPath = pPath.replace("/")
                //console.log(pPath)
                db.query('UPDATE user SET ? WHERE roll = ?',[{fname: req.body.fname, lname: req.body.lname, dob: req.body.dob,email: req.body.email, location: req.body.location, profile_picture:pPath},req.user.roll],
                (error,result)=>{
                    if(error) throw error
                    else{
                        console.log(result);
                        res.status(200).redirect("/profile")
                    }
                })
            }
        }
    } catch (error) {
        console.log("before");
        console.log(error)
    }
}

exports.signOut = async (req,res)=>{
    res.cookie('xtacookie','signout',{
        expires: new Date(Date.now() + 2*1000),
        httpOnly: true
    })
    //
    res.status(200).redirect("/")
}

//
//uploading product picture as same before
global.productStorage = multer.diskStorage({
    destination: (req,file,cb)=>{
        cb(null,"public")
    },
    filename:(req,file,cb)=>{
        let pathUrl = "/images/uploaded/product/"+ req.user.roll +"_"+ req.body.product_type +"_"+Date.now() +"_"+file.fieldname+ path.extname(file.originalname)
        cb(null,pathUrl)
    }
})

global.productUpload = multer({storage: productStorage})

exports.createPost = async (req,res,err)=>{
    try {
        console.log(" Your request has been received!!!")
        var today = new Date()
        var dd = String(today.getDate()).padStart(2, '0')
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear()
        today = mm + '/' + dd + '/' + yyyy
        // console.log(today)
        //console.log(req.body)
        // console.log(req.user)
        const roll = req.user.roll
        const product_type = req.body.product_type
        const brand = req.body.brand
        const model = req.body.model
        const name =  req.body.name
        const author = req.body.author
        const description = req.body.description
        const price = req.body.price
        const location = req.body.location
        const spoint = req.body.from
        const epoint = req.body.to
        const starting_time = req.body.time
        const total_product = req.body.totalseat
        const sold = "no"
        const dop = today
        const product_condition = req.body.condition
        const negotiation = req.body.negotiation
        const ticket_type = req.body.ticket_type
        //
        //inserting create post data in database
        //before inserting database we need to cheeck weather there are files were not
        //as here we are accepting two pictures...we have to use req.files...with s
        //console.log(req.files)
        let data
        let pic1Path = req.files[0].path.replace("public","..")
        let pic2Path = req.files[1].path.replace("public","..")
        console.log( pic1Path +" "+ pic2Path );
        if(!req.files || err instanceof multer.MulterError){
            data= {roll:roll,product_type: product_type,brand: brand,model :model,name :name,author :author,description :description,price :price,location :location,spoint :spoint,epoint :epoint,starting_time :starting_time,total_product :total_product,sold :sold,dop :dop,product_condition :product_condition,negotiation :negotiation,ticket_type :ticket_type}
        }
        else{
            data= {roll:roll,product_type: product_type,brand: brand,model :model,name :name,author :author,description :description,price :price,location :location,spoint :spoint,epoint :epoint,starting_time :starting_time,total_product :total_product,sold :sold,dop :dop,product_condition :product_condition,negotiation :negotiation,ticket_type :ticket_type,img1: pic1Path,img2: pic2Path}
        }
        let sql = "INSERT INTO posts SET ?"
        db.query(sql,data,(error,result)=>{
            if(error){
                console.log(error)
            }
            else{
                res.status(200).redirect("/profile")
            }
        })
    } catch (error) {
        console.log(error)
    }
}



//fname: req.body.fname, lname: req.body.lname, dob: req.body.dob,email: req.body.email, location: req.body.location, profile_image:req.body.profilepicture