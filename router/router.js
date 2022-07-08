const router = require("express").Router()
const {PrismaClient}=require("@prisma/client")
const prisma= new PrismaClient();
const cloudinary = require('../modules/clodinary')
const{ createToken, virifyToken }=require("../modules/jesonwebtoken");
const uplode = require("../modules/multer");

// home page
router.get('/register',async(req,res)=>{
    res.render("register")
})
router.post('/register', async (req, res) => {
    const { name, email, password, role } = req.body
    const user = await prisma.customers.findUnique({
        where: { email }
    })
    if (user == null) {
        const sent = await prisma.customers.create({
            data: { name, email, password, role }
        })
        return res.redirect("./Showall")
        // res.send("done")
    }
    res.send('User already exists')
})
router.get('/login',async(req,res)=>{
    res.render("login")
})
router.post('/login', async (req, res) => {
    const { email, password } = req.body
    const user = await prisma.customers.findMany({
        where: { email, password }
    })
    if (user.length == 1) {
        let token = createToken(user[0])
        // console.log(token);
        res.cookie("Cookie", token)
        return res.redirect("/shipment")
        // return res.send("login successful")
    }
    res.render("register")
    // res.send("login successful")

})

// Extradetails
router.get("/shipment",(req,res)=>{
    res.render("Extradetailes")
})

router.post('/shipment', virifyToken, async (req, res) => {
    const { address, country, state, city, pincode } = req.body
    const { id, email } = req.userData
    try {
        const details = await prisma.customers.findMany({ where: { email }, include: { Extradetails: true } })
        if (details[0].Extradetails.length == 0) {
            const fill = await prisma.extradetails.create({
                data: { customerId: id, address, country, state, city, pincode }
            })
            res.render("peyment")
            // res.send("data field")
            return
        }
        // res.render("peyment")
        res.send("already have")
    } catch (error) {
        res.status(500).send(error.message)
    }
})

// show all product
router.get('/Showall', async (req, res) => {
    let data = await prisma.products.findMany()
    // res.send(data)
    let count = 0
    let arrey = []
    let arr1 = []
    data.forEach((arr) => {
        arrey.push(arr)
        count++
        if (count == 4) {
            arr1.push(arrey)
            count = 0
            arrey = []
        }
    })
    res.render("index", { articles: arr1 })
    // res.send(arr1)
})

router.get('/warehouse', (req, res) => {
    res.render("warehouse")
})
router.post('/warehouse', virifyToken, uplode.single("image"), async (req, res) => {
    const { id, role } = req.userData
    const { name, title, discription, Quntity, price } = req.body
    if (role == 'ADMIN') {
        let img = await cloudinary.uploader.upload(req.file.path)
        let image = img.secure_url
        const data = await prisma.products.createMany({
            data: { customersId: Number(id), name, title, discription, Quntity, price, image }
        })
        // return res.send("upload succesfully")
        return res.render("warehouse")
    }
    res.render("warehouse")
    // res.send("product page")
})

// peyment Info
router.post("/peyment",virifyToken, async (req, res) => {
    const { method, detail, name } = req.body
    const { id } = req.userData
    const data = await prisma.peyment.createMany({
        data: { userId: id, method, detail, name }
    })
    res.redirect("/Showall")
    // res.send("showdata")
})

module.exports = router