const express = require('express');
const passport = require('passport')
const bcrypt = require('bcryptjs')
const User = require('./models/User')
const router = express.Router();
require('dotenv').config()

const mailjet = require ('node-mailjet')
.connect(process.env.MJ_APIKEY_PUBLIC, process.env.MJ_APIKEY_PRIVATE)

router.use((req,res,next)=>{
    res.locals.user = req.user
    res.locals.errors =req.flash('errors')
    res.locals.success = req.flash('success')
    next()
  })
  
const auth = ((req,res,next)=>{
    if(req.isAuthenticated()){
        next()
    }else
    res.redirect('/notallowed')
  })



router.get('/login',(req,res)=>{
    res.render('login')
  })
router.get('/signup',(req,res)=>{
    res.render('signup')
})
router.get('/logged',auth,(req,res)=>{
    res.render('logged')
})
router.get('/thankyou',(req,res)=>{
    res.render('thankyou')
  })

router.post('/login',passport.authenticate('local-login', {
    successRedirect: '/logged',
    failureRedirect:'/login',
    failureFlash: true
  })
)
router.get('/activation/:username',(req,res)=>{
    User.findOne({username:req.params.username}).then((user)=>{
        if(!user){
            res.status(400).json({message:'User not found'})
        }if(user.defaultPassword === false){
            res.render('notAllowed')
        }
        else{
        res.render('activationbyuser',{user:user})
        }
})
})
// router.get('/activation',(req,res)=>{
  
//         res.render('activation')

// })
router.post('/activation/:username',(req,res)=>{
    User.findOne({username:req.params.username}).then((user)=>{
        if(!user){
            res.status(400).json({message:'User not found'})
        }if(user.defaultPassword === false){
            res.status(400).json({message:'Page Not Found'})
        }
        else{
            const inputPassword = req.body.password
            const newPassword = req.body.newPassword
            console.log(newPassword)
            if(inputPassword !== user.password){
                res.status(400).json({message:'Wrong password'})
            }else{
                const salt = bcrypt.genSaltSync(10)
                const hash = bcrypt.hashSync(newPassword,salt)
                user.password = hash
                console.log(user.password)
                user.defaultPassword = false
                console.log(user.defaultPassword)
                user.save()
                res.redirect('/logged')
            }
        }
    })
})
// router.post('/activation',(req,res)=>{
//     User.findOne({username:req.body.username}).then((user)=>{
//         if(!user){
//             res.status(400).json({message:'User not found'})
//         }if(user.defaultPassword === false){
//             res.status(400).json({message:'Page Not Found'})
//         }
//         else{
//             const inputPassword = req.body.password
//             const newPassword = req.body.newPassword
//             console.log(newPassword)
//             if(inputPassword !== user.password){
//                 res.status(400).json({message:'Wrong password'})
//             }else{
//                 const salt = bcrypt.genSaltSync(10)
//                 const hash = bcrypt.hashSync(newPassword,salt)
//                 user.password = hash
//                 console.log(user.password)
//                 user.defaultPassword = false
//                 console.log(user.defaultPassword)
//                 user.save()
//                 res.redirect('/thankyou')
//             }
//         }
//     })
// })
router.post('/signup',(req,res)=>{
    User.findOne({username:req.body.username}).then((user)=>{
        if(user){
            res.status(400).json({message:'User Exists'})
            // req.flash('errors', 'Account Exists')
            // return res.redirect(301, '/users/signup')
        }else{
        const newUser = new User()
        // const salt = bcrypt.genSaltSync(10)
        // const hash = bcrypt.hashSync(req.body.password,salt)
        newUser.username = req.body.username
        newUser.name = req.body.name
        newUser.email = req.body.email
        newUser.address.number = req.body.number
        newUser.address.city = req.body.city
        newUser.address.state = req.body.state
  
        newUser.save().then((user)=>{
            const request = mailjet.post("send", {'version': 'v3.1'}).request({
                "Messages":[
                    {
                    "From": {
                        "Email": "wilson.chen@codeimmersives.com",
                        "Name": "wilson"
                        },
                        "To": [
                        {
                            "Email": user.email,
                            "Name": user.name
                        }
                        ],
                        "Subject": "Greetings from Mailjet.",
                        "TextPart": "My first Mailjet email",
                        "HTMLPart": `<h3>Dear ${user.username}, welcome to WilApp!</h3><br />Please visit the following link to activate your account! Your temporary password is ${user.password}<br /><br /><br /> http://localhost:3000/activation`,
                        "CustomID": "AppGettingStartedTest"
                    }
                        ]
                    })
                    request
                    .then((result) => {
                    console.log(result.body)
                    }).catch((err) => {
                    console.log(err.statusCode)
                        })
                        res.redirect('/thankyou')

                        }).catch((err)=>console.log('error'))
                        }
                        })

                    })

module.exports = router