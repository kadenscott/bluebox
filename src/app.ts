import express from 'express'
import multer from 'multer'
import {DATA_DIR, PUBLIC_DIR} from "./util"
import db from './db'
import {generateName} from "./name";
import mime from 'mime-types'
import * as fs from "fs";

if (process.env.PRODUCTION === "true") {
    console.log("Running in production mode")
} else {
    console.log("Running in development mode")
}

if (!fs.existsSync(DATA_DIR+"/images")) {
    fs.mkdirSync(DATA_DIR+"/images")
}

if (!fs.existsSync(DATA_DIR+"/images/images")) {
    fs.mkdirSync(DATA_DIR+"/images/images")
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, DATA_DIR+"/images/images");
    },
    filename(req: express.Request, file: Express.Multer.File, callback: (error: (Error | null), filename: string) => void) {
        let extension = mime.extension(file.mimetype)

        callback(null, Date.now()+"."+extension)
    }
})

const upload = multer({storage: storage})

const app = express()
const PORT = 8080;

app.post("/upload", upload.single('file'), (req, res, next) => {
    if (req.body.auth === undefined || req.body.auth !== process.env.AUTH_KEY) {
        res.status(400).json({
            "error": "invalid authentication key"
        })
        return
    }

    if (req.file) {
        generateName().then(name => {
            db.serialize(() => {
                let stmt = db.prepare("INSERT INTO image (filename, imagename, creationdate) VALUES (?, ?, ?)",
                    [req.file.filename, name, new Date().toString()])

                stmt.run((err) => {
                    if (err) {
                        console.log(err)
                    }
                })

                stmt.finalize((err) => {
                    if (err) {
                        console.log(err)
                    }
                })

                res.json({
                    filename: req.file.filename,
                    imagename: name,
                    date: new Date().toString()
                })
            })
        })
    }
})

app.get("/:filename", (req, res) => {
    const filename = req.params.filename
    const sql = "SELECT * FROM image WHERE imagename = ?"

    db.get(sql, [filename], (err, row) => {
        if (err) {
            console.log(err)
            res.status(400).json({"error": err})
            return
        }

        if (row === undefined) {
            res.json({"error": "no file found"})
            return
        }

        let filename = row.filename

        res.type("image/png")
        res.sendFile(DATA_DIR+"/images/images/"+filename)
    })
})

app.get("/", (req, res) => {
    res.sendFile(PUBLIC_DIR+"/avatar.png")
})

app.listen(PORT, () => {
    console.log("Running")
})