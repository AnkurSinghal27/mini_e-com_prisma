const multer = require("multer")
const path = require("path")

const uplode = multer({
    storage: multer.diskStorage({
        filename: ((req, file, cd) => {
            let ext = path.extname(file.originalname);
            if (ext != ".jpg" && ext != ".jpeg" && ext != ".pdf" && ext != ".png") {
                cd(new Error("file type is not saport"), false)
                return;
            }
            cd(null, "true")
        })
    })
})

module.exports = uplode