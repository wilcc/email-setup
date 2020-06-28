const express = require('express');
const router = express.Router();
const controller = require('./controller/controller')

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
router.get('/activation/:username',controller.getActivated)

router.post('/login',controller.auth)
router.post('/activation/:username',controller.activation)
router.post('/signup',controller.signUp)
// router.get('/activation',(req,res)=>{
  
//         res.render('activation')

// })
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

module.exports = router