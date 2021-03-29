var express = require('express');

var PasswordRouter = express.Router();

PasswordRouter.route('/')
    .get(function(req, res){
        res.render('passgen', { 
            nav: req.app.locals.navlinks
    } );
});

module.exports = PasswordRouter;