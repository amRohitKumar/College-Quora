const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn } = require('../utils/middleware');
router.get('/register', (req, res) => {
    res.render('user/register');
})

router.post('/register', catchAsync(async (req, res) => {
    try {
        const { name, username, email, password } = req.body;
        const newUser = new User({ name: name, emailId: email, username: username });
        registerdUser = await User.register(newUser, password);
        req.login(registerdUser, err => {
            if(err) return next(err);
            req.flash('success', `Welcome to College-Quora ${req.user.name}!`);
            res.redirect('/collegeQuora');
        })
    } catch (err) {
        req.flash('error', err.message);
        res.redirect('/register');
    }
}))


router.get('/login', (req, res) => {
    res.render('user/login');
})

router.get("/login/google", passport.authenticate("google", {scope: ["profile", "email"]}));

router.get("/login/google/redirect", passport.authenticate('google', {failureRedirect: '/register'}), async (req, res) => {
    let userId = req.user._id;
    const name = req.user.name;
    req.session.currentUser = req.user;
    req.session.bypass = true;
    req.flash('success', `Welcome to College-Quora ${name}`)
    res.redirect(`/collegeQuora`);
});


router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), catchAsync(async (req, res) => {

    req.flash('success', `Welcome back ${req.user.name}!`);
    let redirectUrl = req.session.returnTo || '/collegeQuora';
    // const prevMethod = req.session.prevMethod;
    // if(prevMethod === "POST" || prevMethod === "DELETE"){
    //     redirectUrl = `/collegeQuora/${req.session.prevID}`;
    // }
    res.redirect('/collegeQuora');
}))


router.get('/logout', (req, res) => {
    req.session.bypass = false;
    req.session.currentUser = null;
    req.logout();
    req.flash('success', `Goodbye ${req.user.name} !`);
    res.redirect('/');
})

module.exports = router;

