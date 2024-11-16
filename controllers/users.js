const User = require("../models/user.js")

module.exports.renderSignupFrom = ( req,res ) => {
    res.render("users/signup.ejs");
}
module.exports.signup = async( req,res, next ) => {
    try{
        let{ username, email, password } = req.body;
        const newUser = new User({ username, email });

        const registeredUser = await User.register(newUser,password);
        console.log(registeredUser);
        req.login(registeredUser,(err) => {
            if(err){ return next(err);}
            req.flash("success","Welcome to Wanderlust!")
            return res.redirect("/listings");
        });
    }catch(e){
        req.flash("error",e.message);
        return res.redirect("/signup");
    }
}

module.exports.renderLoginFrom = ( req,res ) => {
    res.render("users/login.ejs");
}

module.exports.login =  async( req,res, ) =>{
    req.flash("success","Welcome back to Wanderlust, You are Login");
    let redirectUrl = res.locals.redirectUrl || "/listings" ;
    res.redirect(redirectUrl);
}

module.exports.logout = (req,res,next) =>{
    req.logout((err) =>{
        if(err){
         return next(err);
        }
        req.flash("success","You are log out!");
        res.redirect("/listings");
    })
}