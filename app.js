if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("./models/user.js");


const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

// Initialize application
const app = express();
const port = process.env.PORT || 8080;

// Database connection
const dbUrl = process.env.ATLASDB_URL;
mongoose.connect(dbUrl)
    .then(() => console.log("Successfully connected to DB"))
    .catch(err => console.error("DB connection error:", err));

// Set up view engine
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
     secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600
 });

 store.on("error",(err) => {
    console.log("ERROR in MONGO SESSION STORE", err);
 });
// Session configuration
const sessionOptions = {
    store:store,
    secret: process.env.SECRET,
    resave : false,
    saveUninitialized : true,
    cookie:{
        expires: Date.now() + 30 * 24 * 60 * 60 * 1000,
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
};
// Middleware setup
app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
 
// Passport configuration
passport.use(new LocalStrategy(async (username, password, done) => {
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return done(null, false, { message: 'Incorrect username.' });
        }   
        if (!user.password === password) {
            return done(null, false, { message: 'Incorrect password.' });
        }
        return done(null, user);
    } catch (err) {
        return done(err);
    }
}));

passport.serializeUser ((user, done) => {
    done(null, user ? user.id : false);
});
passport.deserializeUser (async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user || false);
    } catch (err) {
        done(err);
    }
});

//Middleware
app.use((req,res,next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

app.use((req, res, next) => {
    console.log("Request URL:", req.originalUrl);
    next();
});

//this  is the route for listing
app.use("/listings",listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/",userRouter);

// app.get("/listings",(req,res)=>{
//     res.flash("error","Page is not Found!");
//     res.render("index");

// })

app.use((err,req,res,next)=>{
    let{ statusCode=500 , message="Something went wrong!" } = err;
    res.status(statusCode).render("listings/error",{ message, statusCode });
    next(err);
});

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
});
