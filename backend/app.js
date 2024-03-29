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

// GET ALL DOCUMENTS
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

// GET DOCUMENTS BASED ON USERID
app.get('/documents/:userId', (req, res) => {
    const userId = req.params.userId;

    const sql = 'SELECT * FROM documents WHERE authorId = ?';

    connection.query(sql, [userId], (err, result) => {
        if (err) {
            console.log('err', err);
            res.status(500).json({error: 'Server Error'});
        } else {
            console.log('Documents result:', result);
            res.json(result);
        }
    })
});

// CREATE NEW DOCUMENT
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

// GET SPECIFIC DOCUMENT BASED ON USERID AND DOC ID
app.get('/documents/:userId/:docId', (req, res) => {
    const userId = req.params.userId;
    const docId = req.params.docId;
  
    const sql = 'SELECT * FROM documents WHERE authorId = ? AND id = ?';
    
    connection.query(sql, [userId, docId], (err, result) => {
        if (err) {
            console.log('err', err);
            res.status(500).json({ error: 'Server Error' });
        } else {
            if (result.length > 0) {
            res.json(result[0]); 
            } else {
            res.status(404).json({ error: 'Document not found' });
            }
        }
    });
});

// UPDATE DOCUMENT BASED ON USERID AND DOC ID
app.patch('/documents/:userId/:id', (req, res) => {
    const userId = req.params.userId;
    const id = req.params.id;
    const { title, content } = req.body;

    const sql = 'UPDATE documents SET title = ?, content = ? WHERE authorId = ? AND id = ?';

    connection.query(sql, [title, content, userId, id], (err, result) => {
        if (err) {
            console.log('err', err);
            res.status(500).json({error: 'Server Error'});
        } else {
            console.log('Document updated:', result);
            res.json({message: 'Document updated successfully'});
        }
    })
});

// DELETE DOCUMENT 
app.delete('/documents/:userId/:id', (req, res) => {
    const id = req.params.id;
    const userId = req.params.userId;

    let query = 'DELETE FROM documents WHERE authorId = ? AND id = ?';

    let values = [userId, id];

    connection.query(query, values, (err, data) => {
        if (err) console.log('err', err);

        console.log('documents', data);
        res.json({ message: 'Document deleted' });
    });
});

// GET USER
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

app.post('/users', (req, res) => {
    const { username, password } = req.body;

    const sql = 'INSERT INTO users (username, password) VALUES (?, ?)';

    connection.query(sql, [username, password], (err, result) => {
        if (err) {
            console.log('err', err);
            res.status(500).json({error: 'Server error'});
        } else {
            console.log('User created:', result);
            res.status(201).json({message: 'User created successfully'});
        }
    })
});

// LOGIN USER
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    const sql = 'SELECT * FROM users WHERE username = ? AND password = ?';

    connection.query(sql, [username, password], (err, result) => {
        if (err) {
            console.log('err', err);
            res.status(500).json({error: 'Server Error'});
        } else {
            if (result.length > 0) {
                const user = result[0];
                res.json({message: 'Login successful', userId: user.userId});
            } else {
                res.status(401).json({message: 'Fel username eller password'});
            }
        }
    })
});

module.exports = app;
