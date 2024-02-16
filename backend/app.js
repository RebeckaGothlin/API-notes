var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');

const connection = require('./lib/conn');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.get('/documents', (req, res) => {
    connection.connect((err) => {
        if (err) console.log('err', err);

        let query = 'SELECT * FROM documents';

        connection.query(query, (err, data) => {
            if (err) console.log('err', err);

            console.log('documents', data);

            res.json(data);
        })
    })
});

app.get('/documents/:authorId', (req, res) => {
    const authorId = req.params.authorId;

    const sql = 'SELECT * FROM documents WHERE authorId = ?';

    connection.query(sql, [authorId], (err, result) => {
        if (err) {
            console.log('err', err);
            res.status(500).json({error: 'Server Error'});
        } else {
            console.log('Documents result:', result);
            res.json(result);
        }
    })
});

app.post('/documents', (req, res) => {
    const { title, content, authorId } = req.body;

    const sql = 'INSERT INTO documents (title, content, authorId) VALUES (?, ?, ?)';

    connection.query(sql, [title, content, authorId], (err, result) => {
        if (err) {
            console.log('err', err);
            res.status(500).json({error: 'Server Error'});
        } else {
            console.log('Document created:', result);
            res.status(201).json({message: 'Document created successfully!'});
        }
    })
});

app.get('/users/:userId', (req, res) => {
    const userId = req.params.userId;

    const sql = 'SELECT * FROM users WHERE userId = ?';

    connection.query(sql, [userId], (err, result) => {
        if (err) {
            console.log('err', err);
            res.status(500).json({error: 'Server Error'});
        } else {
            console.log('User result:', result);
            if (result.length > 0) {
                res.json(result[0]);
            } else {
                res.status(404).json({error: 'User not found'});
            }
        }
    })
});

module.exports = app;
