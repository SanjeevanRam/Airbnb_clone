const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");
const userController = require("../controllers/users.js");

router.route("/signup")
.get(userController.renderSignupFrom)
.post(wrapAsync(userController.signup));

router.route("/login")
.get(userController.renderLoginFrom)
.post(
    saveRedirectUrl,
    passport.authenticate("local",{
        failureRedirect: "/login",
        failureFlash:true,
        successRedirect:true,
        successFlash:true,
    }),
        (req, res, next) => {
            if (!req.user) {
                req.flash("error", "Authentication failed.");
                return res.redirect("/login");
            }
            next(); 
        },
    userController.login
);

router.get("/logout",userController.logout)

module.exports = router;