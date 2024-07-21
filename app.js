if(process.env.NODE_ENV!="production"){
    require("dotenv").config();
}

const express=require("express");
const app=express();
const path=require("path");
const listing=require("./models/listing.js");
const ejsmate=require("ejs-mate");
const asyncwrap=require("./utill/asyncwrap.js");
const expresserror=require("./utill/expresserror.js");
const {listingschema,reviewschema}=require("./Schema.js");
const review=require("./models/review.js");
const session=require("express-session");
const MongoStore = require('connect-mongo');
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");

const listingsRouter=require("./routes/listing.js");  
const reviewsRouter=require("./routes/review.js");    
const userRouter=require("./routes/user.js");
const cors=require("cors");

const DbUrl=process.env.ATLASDB_URL;


const mongoose = require('mongoose');
const port=8080;

main()
.then(()=>{
    console.log("connection successfull");
})
.catch(err => console.log(err));

async function main() {
    await mongoose.connect(DbUrl);
}

app.use(express.static(path.join(__dirname,"/public/css")));

app.set("view engiene","ejs");
app.set("views",path.join(__dirname,"/views"));

const methodoverride=require("method-override");

app.use(express.urlencoded({extended:true}));
app.use(methodoverride('_method')); 
app.use(cors());
app.use((req, res, next) => {
    res.header({"Access-Control-Allow-Origin": "*"});
    next();
}) 

app.engine("ejs",ejsmate);

app.listen(port,()=>{
    console.log(`app is listening on port ${port}`);
})

const store=MongoStore.create({
    mongoUrl:DbUrl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*3600,
})

store.on("error",()=>{
    console.log("error in mongo session store", err)
})

const sessionOptions={
    store,
    secret:process.env.SECRET,
    resave:true,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+ 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly:true
    }
}

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.successMsg=req.flash("success");
    res.locals.Delete=req.flash("Delete");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user; 
    next();
})

app.use("/listings",listingsRouter);
app.use("/listings/:id/review",reviewsRouter);
app.use("/",userRouter);


app.get("/privacy",(req,res)=>{
    res.render("./listings/privacy.ejs");
})

app.get("/terms",(req,res)=>{
    res.render("./listings/terms.ejs");
})

app.all("*",(req,res,next)=>{
    next(new expresserror(404,"page not found"));
})

app.use((err,req,res,next)=>{
    let {Status=500,message="something went wrong."}=err;
    res.render("error.ejs",{message});
});


