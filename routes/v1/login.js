var router = require('express').Router();
var passport = require('passport')
var mongoose = require('mongoose')
var User = mongoose.model('User')

router.get('/',(req,res)=>{
    let info = {
        redirect:req.query.red
    }
    res.render('client/login',{info:info})
})


router.post('/',(req,res)=>{
            passport.authenticate("user")(req,res,function(err,user){
                if(err){
                    res.redirect(`/login?msg=${err}`)
                } else {
                    res.redirect(req.body.redirect ||  '/')
                }  
            })
       
})

router.get('/google',passport.authenticate('google',{scope: ['profile','email','address','phone']}))


router.get('/google/user/callback',
  passport.authenticate('google',{
    successRedirect:'/',
    failureRedirect:'/login'
}))

router.get('/admin',(req,res)=>{
    let info = {
        redirect:req.query.red
    }
    res.render('admin/login',{info:info})})


router.post('/admin',(req,res)=>{
    let isMail = /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/.test(req.body.username)
    console.log(isMail);
    if(isMail){
        passport.authenticate("adminEmail")(req,res,function(err,user){
            if(err){
                res.send(err)
                // res.redirect(`/login/admin?msg=${err}`)
            } else {
                res.redirect('/admin/dashboard')
            }  
        }) 
    } else {
        passport.authenticate("admin")(req,res,function(err,user){
            if(err){
                res.send(err)
                // res.redirect(`/login/admin?msg=${err}`)
            } else {
                res.redirect('/admin/dashboard')
            }  
        }) 
    }
                   
}) 

router.get('/google/admin',passport.authenticate('googleAdmin',{scope: ['profile','email']}))

router.get('/google/admin/callback',
  passport.authenticate('googleAdmin',{
    successRedirect:'/admin/dashboard',
    failureRedirect:'/login/admin'
}))





module.exports = router