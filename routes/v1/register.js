var router = require('express').Router();
var passport = require('passport')
var mongoose = require('mongoose')
var User = mongoose.model('User')
const nodemailer = require('nodemailer');
var jwt = require('jsonwebtoken');
const fs = require('fs')
var ejs = require('ejs');
const { emailTemplate } = require(process.env.root+'/utils/ejsHelper');
require('dotenv').config()


const JWT_EMAIL = process.env.JWT_EMAIL_SECRET
const EMAIL_VAR_LINK = process.env.EMAIL_VARIFICATION_LINK
const GMAIL = process.env.GMAIL_USERNAME
const GPASS = process.env.GMAIL_PASS

// let transporter = nodemailer.createTransport({
//     host: "smtp.gmail.com",
//     port: 465,
//     secure: true,
//     auth: {
//       type:'login',
//       user:GMAIL,
//       pass: GPASS,
//     },
//   });

router.get('/',(req,res)=>{
    res.json({
        status:200,
        message:'Please post to this end'
    })
})

router.post('/',(req,res)=>{
    const {email,password} = req.body
    User.findOne(email,(err,found)=>{
        if(err){res.json({status:400,message:err})}
        if(found){
            res.json({status:100,message:'Already a user with this email'})
        } else {
            const token = jwt.sign({
                data: {email,password},
              },JWT_EMAIL,{expiresIn:600})
            transporter.sendMail({
             html:emailTemplate({
                url:`${EMAIL_VAR_LINK}/${token}`,
                commercial:false
             }),
            from: "kavyarahul9610@gmail.com",
            to: email,
            subject: "Email varification",
            
          });
          res.json({status:200,message:'Varification email sent'})
        }
    })
   
    
})


router.get('/verify/:token',(req,res)=>{
    const token = req.params.token
    jwt.verify(token, JWT_EMAIL, function(err, {data:{email,password},iat,exp}) {
        if(!err){
           var user = new User({
               email,
               password
           }) 
           user.save((err)=>{
                if(!err){
                    res.send({})
                } else {
                    res.json({status:400,message:err})
                }
           })
        } else {
            console.log(err);
        }
      });
})





router.post('/:id',(req,res)=>{
    const fields = req.body
    const id  = req.params.id
    User.findByIdAndUpdate(id,fields,{new:true },(err,updated)=>{
        if(!err){
            res.json(updated)
        } else {
            res.send()
        }
    })
}) 
module.exports= router