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
    const query = `SELECT vl.video_id ,vl.video_url ,vl.video_thumbnail ,vl.video_title ,
     vl.video_created_at ,c.channel_id ,c.channel_name ,c.channel_profile_picture, p.view_count 
    FROM videos_long as vl 
    JOIN channels AS c ON vl.channel_id = c.channel_id 
    JOIN popular AS p ON vl.video_id = p.video_id`;

    db.query(query,(err, result) => {
        if (err) {
            throw err
        }else{
            res.json(result)
        }
    })
})

app.get(`/subscribe`,(req,res)=>{
    const user_id = req.query.user_id;
    if(!user_id){
        res.status(400).send('กรุณาระบุ user_id');
        return;
    }

    const query = `SELECT u.user_id , u.user_name , u.user_profile_picture , c.channel_id, c.channel_name, c.channel_profile_picture 
    FROM users AS u 
    JOIN channels_subscribe AS cs ON u.user_id = cs.user_id
    JOIN channels AS c on cs.channel_id = c.channel_id
    WHERE u.user_id = ?`;

    const values =[user_id]

    db.query(query, values,(err, result) => {
        if (err) {
            throw err
        }else{
            res.json(result)
        }
      
    })
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})