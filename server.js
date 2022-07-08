const express = require("express")
const app = express()
const ejs = require("ejs")
const path = require("path")
require("dotenv").config()


const viewsPath = path.join(__dirname,"./templates/views")
const publicPath = path.join(__dirname,"./templates/public")

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static(publicPath))
app.set("view engine","ejs")
app.set("views",viewsPath)
app.use("/",require("./router/router"))

app.listen(3030,()=>{
    console.log("conected 3030");
})