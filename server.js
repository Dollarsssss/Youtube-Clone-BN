const express = require('express')
const mysql = require('mysql2')
const dotenv = require('dotenv')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()
const port = 3000

dotenv.config();
app.use(bodyParser.json())
app.use(cors())

const db = mysql.createConnection({
    host: process.env.DBHOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT
})

db.connect((err) => {
    if (err) {
        throw err
    }
    console.log("Database already connected");
})

app.get('/', (req, res) => {
    const query = `SELECT * FROM users`;

    db.query(query,(err, result) => {
        if (err) {
            throw err
        }
        res.send(result)
    })
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})