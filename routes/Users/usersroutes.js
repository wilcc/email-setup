const express = require('express');
const passport = require('passport')
const bcrypt = require('bcryptjs')
const User = require('./models/User')
const router = express.Router();
require('dotenv').config()

const mailjet = require ('node-mailjet')
.connect(process.env.MJ_APIKEY_PUBLIC, process.env.MJ_APIKEY_PRIVATE)
// const {check,validationResult} = require('express-validator')



router.get('/login',(req,res)=>{
    res.render('login')
  })
router.get('/signup',(req,res)=>{
    res.render('signup')
})
router.get('/logged',(req,res)=>{
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
router.post('/signup',(req,res)=>{
    User.findOne({username:req.body.username}).then((user)=>{
        if(user){
            res.status(400).json({message:'User Exists'})
            // req.flash('errors', 'Account Exists')
            // return res.redirect(301, '/users/signup')
        }else{
        const newUser = new User()
        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(req.body.password,salt)
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
                        "HTMLPart": "<h3>Dear passenger 1, welcome to <a href='https://www.mailjet.com/'>Mailjet</a>!</h3><br />May the delivery force be with you!",
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
                        res.redirect('/users/thankyou')

                        }).catch((err)=>console.log('error'))
                        }
                        })

                    })

module.exports = router