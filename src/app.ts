import express from 'express'

const app = express()
const PORT = 8000;

app.get("/", (req, res) => {
    console.log("poop")
})

app.listen(PORT, () =>  {
    console.log("Running")
})