const express=require("express")
const app =express();
const cookieParser=require("cookie-parser")
const bodyParser = require("body-parser")
const path = require("path");

const fileUpload = require('express-fileupload');
const dotenv=require("dotenv")

const errorMidleware=require("./middleware/error")
// Config

dotenv.config({path:"backend/config/config.env"})

app.use(express.json())
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended:true}));
app.use(fileUpload()); 


// Route Imports
const User=require("./routes/userRoute")
const client = require("./routes/clientRoutes")
const booking = require("./routes/bookingRoutes")
const payment = require("./routes/paymentRoute")

app.use("/api/v1",User)
app.use("/api/v1",client)
app.use("/api/v1",booking)
app.use("/api/v1",payment)


app.use(express.static(path.join(__dirname, "../frontend/build")));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"));
});

// Middleware for error
app.use(errorMidleware);


module.exports=app;