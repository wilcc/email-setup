const mongoose = require('mongoose')
const nanoid = require('nanoid')
// import {nanoid}from 'nanoid'

const UserSchema = new mongoose.Schema({
    username:{type:String, require:true, lowercase:true,unique:true},
    name:{type:String, require:true, lowercase:true},
    email:{type:String,unique:true,required:true,lowercase:true},
    password:{type:String,required:true, min:3,default:()=>nanoid()},
    address:{number:{type:String,required:true},city:{type:String,required:true},state:{type:String,required:true}}
})


module.exports = mongoose.model('user',UserSchema)