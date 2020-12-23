import express from 'express'
import multer from 'multer'
import {DATA_DIR, isProduction, PUBLIC_DIR} from "./util"
import db from './db'
import {generateName} from "./name";
import mime from 'mime-types'
import * as fs from "fs";
import router from "./route/api";

if (isProduction()) {
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

const app = express()
const PORT = isProduction() ? 80 : 8080;

app.use("/api", router)

app.listen(PORT, () => {
    console.log("Running")
})