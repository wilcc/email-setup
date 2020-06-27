const mongoose = require('mongoose')
const nanoid = require("nanoid/non-secure")
// import {nanoid}from 'nanoid'
let password = nanoid()
const UserSchema = new mongoose.Schema({
    username:{type:String, require:true, lowercase:true,unique:true},
    name:{type:String, require:true, lowercase:true},
    email:{type:String,unique:true,required:true,lowercase:true},
    password:{type:String,required:true, min:3,default:password},
    address:{number:{type:String,required:true},city:{type:String,required:true},state:{type:String,required:true}},
    defaultPassword:{type:Boolean,required:true,default:true}
})


module.exports = mongoose.model('user',UserSchema)