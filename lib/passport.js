const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')
const User = require('../routes/Users/models/User')


passport.serializeUser((user,done)=>{
    done(null, user._id)
})

passport.deserializeUser((id,done)=>{
    User.findById(id,(err,user)=>{
        done(err,user)
    })
})

passport.use('local-login',
    new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true
},(req,username,password,done)=>{
    User.findOne({username}, (err,user)=>{
        if(err){
            return done(err,null)
        }
        if(!user){
            return done(null,false,
                req.flash('errors', "User Not Found"
                // console.log('user error')
                )
                )
        }

        bcrypt.compare(password, user.password).then((result)=>{
            if(!result){
                return done(null, false, 
                    req.flash('errors', 'Check username and password')
                    // console.log('error here')
                    )
            }else{
                return done(null,user)
            }
        }).catch((err)=>{
            return done(err,null)
        })
    })
}

)





)