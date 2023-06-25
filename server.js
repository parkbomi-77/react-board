const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const port =process.env.PORT || 3001;
const mysql = require("mysql");
// const low = require('lowdb');
// const FileSync = require('lowdb/adapters/FileSync');
// const adapter = new FileSync('./db.json');
// const db = low(adapter);
// const shortid = require('shortid');

// db.defaults({ posts:[] }).write();

var connection = mysql.createConnection({
    /// 새로 추가된 부분
    host: "localhost",
    user: "root", // mysql에 아이디를 넣는다.
    password: "12345", // mysql의 비밀번호를 넣는다.
    database: "simpleboard", //위에서 만든 데이터베이스의 이름을 넣는다.
  });
  
  connection.connect();

app.use(cors());

app.use(bodyParser.json());

// app.use('/', (req,res) => {
//     console.log('zzz');
//     res.send('오케이!');
// });

app.use('/api/list', (req,res) => {
    connection.query('SELECT * from simpleboard', function (error, results, fields) {
        if (error) throw error;
        res.json(results);
      });
});

app.use('/api/write', (req,res) => {    
    let post = {title: req.body.title, author: req.body.author, content: req.body.content};
    let query = connection.query('INSERT INTO simpleboard SET ?', post, (err, result) => {
        if (err) {
            console.error(err);
            return;
        }
    });
    res.json(id);

});

app.use('/api/read', (req,res) => {
    const id = req.body.id;
    connection.query('SELECT * from simpleboard where id = ?', id, (err, result) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log(result[0]);
        res.json(result[0]);
    });
});

app.use('/api/update', (req,res) => {
    const id = req.body.id;
    const title = req.body.title;
    const author = req.body.author;
    const content = req.body.content;
    let post = {title: title, author: author, content: content};

    let query = 'UPDATE simpleboard SET ? WHERE id = ?';

    connection.query(query, [post, id], (err, result) => {
        if(err) {
            console.error(err);
            res.status(500).send('Server Error');
            return;
        }
        console.log(result);
        res.json(id);
    });
});

app.use('/api/delete', (req,res) => {
    const id = req.body.id;
    connection.query('DELETE FROM simpleboard WHERE id = ?', id, (err, result) => {
        if (err) {
            console.error(err);
            return;
        }
        res.json(result);
    });
});

app.listen(port, ()=>{
    console.log(`express is running on ${port}`);
});