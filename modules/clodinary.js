const cloudinary = require("cloudinary").v2;

const cloud = cloudinary.config({
    cloud_name: process.env.CLOUD_NAME || "djxbqt2cc",
    api_key: process.env.CLOUDINERY_API_KEY || 859133876782387,
    api_secret: process.env.CLOUDINERY_SECREAT_KEY || "jZMGX_711VQKzfDCBe2uQoH-BGc",
    secure: true
})


module.exports = cloudinary;