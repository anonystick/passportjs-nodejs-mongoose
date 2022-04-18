require('dotenv').config();
const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const app =  express();
//body-parser
const {PORT, KEY_SESSION} = process.env;
//express > 4.16
app.use(express.json());

const store = session.MemoryStore();

app.use(session({
    saveUninitialized: false,
    secret: KEY_SESSION,
    cookie: {
        maxAge: 1000 * 20 // 10s
    },
    store
}))
app.use(passport.initialize());
app.use(passport.session());

app.get('/status', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'ok'
    })
})

app.get('/profile', (req, res) => {
    if(req.isAuthenticated()){
        return res.status(200).json({
            status: 'success',
            data: {
                name: 'anonystick',
                age: 38,
                blog: 'anonystick.com'
            }
        })
    }
    res.status(200).json({
        status: 'failed',
        message: 'Missing'
    })
    
})

app.post('/login', passport.authenticate('local', {
    successRedirect: '/profile',
    failureRedirect: '/login'
}), (req, res) => {
    try {
        res.json({
            body: req.body
        })
    } catch (error) {
        res.json({
            error: error.stack
        })
    }
})
const user = {
    username: "123",
    password: "123"
}
passport.use( new LocalStrategy( (username, password, done) => {
    console.log(`username:::${username}, pass::::${password}`);
    if(username === user.username && password === user.password){
        return done(null, {
            username,
            password,
            active: true
        })
    }
    done(null, false)
}))

passport.serializeUser( (user, done) => done(null, user.username));

passport.deserializeUser( (username, done) => {
    console.log(`deserializeUser:::`, username);
    //check username
    if(username === user.username){
        return done(null, {
            username,
            active: true
        })
    }
    done(null, false)
})



app.listen(PORT, () => {
    console.log(`is Okay at ${PORT}`);
})