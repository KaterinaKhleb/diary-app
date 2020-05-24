const express = require('express');
const bodyParser = require('body-parser');
const serveStatic = require("serve-static");
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

const mongolink = process.env.MONGODB_URI || 'mongodb://localhost:27017/testdb';

mongoose.connect("mongodb://katerinushka2603:Pillow17031997@ds151247.mlab.com:51247/diary-app-db").then(
    () => { console.log('Database connection is successful') },
    err => { console.log('Error when connecting to the database' + err) }
);
mongoose.set('useFindAndModify', false);

const app = express();

app.use(serveStatic(path.join(__dirname, 'dist')));

//Middleware
app.use(bodyParser.json());
app.use(cors());


const Note = require('./models/Note');
const Todo = require('./models/Todo');
const Shop = require('./models/Shop');



app.use('/notesdb', (req, res) => {
    Note.find((err, notes) => {
        if (err) {
            console.log(err);
        } else {
            res.json(notes);
            // console.log(res.json(notes))
        }
    });
});

app.use('/createnote', (req, res) => {
    var note = new Note(req.body);
    console.log(note)
    note.save().then(note => {
            res.status(200).json({ 'message': 'Note successfully added ', "note": note });
        })
        .catch(err => {
            res.status(400).send("Error when saving to database");
        });
});


app.use('/deletenote', (req, res) => {
    Note.findByIdAndRemove({ _id: req.body._id }, (err, noteres) => {
        if (err) res.json(err);
        else res.json({ 'message': 'Note successfully removed', 'note': noteres });
    });
});

app.use('/updatenote', (req, res) => {
    Note.findByIdAndUpdate({ _id: req.body.data._id }, { pinned: req.body.data.pinned }, (err, noteres) => {
        if (err) res.json(err);
        else res.json({ 'message': 'Note successfully updated', 'note': noteres });
    });

});


app.use('/todosdb', (req, res) => {
    Todo.find((err, todos) => {
        if (err) {
            console.log(err);
        } else {
            res.json(todos);
            // console.log(res.json(notes))
        }
    });
});

app.use('/createtodo', (req, res) => {
    var todo = new Todo(req.body);
    todo.save().then(todo => {
            res.status(200).json({ 'message': 'Todo successfully added ', "todo": todo });
        })
        .catch(err => {
            res.status(400).send("Error when saving to database");
        });
});

app.use('/deletetodo', (req, res) => {
    Todo.findByIdAndRemove({ _id: req.body._id }, (err, todores) => {
        if (err) res.json(err);
        else res.json({ 'message': 'Todo successfully removed', 'todo': todores });
    });
});

app.use('/updatetodo', (req, res) => {
    Todo.findByIdAndUpdate({ _id: req.body.data._id }, { completed: req.body.data.completed }, (err, todores) => {
        if (err) res.json(err);
        else res.json({ 'message': 'Todo successfully updated', 'todo': todores });
    });

});

app.use('/pintodo', (req, res) => {
    Todo.findByIdAndUpdate({ _id: req.body.data._id }, { pinned: req.body.data.pinned }, (err, todores) => {
        if (err) res.json(err);
        else res.json({ 'message': 'Todo successfully updated', 'todo': todores });
    });

});

app.use('/shopdb', (req, res) => {
    Shop.find((err, todos) => {
        if (err) {
            console.log(err);
        } else {
            res.json(todos);
            // console.log(res.json(notes))
        }
    });
});


app.use('/createshop', (req, res) => {
    var shop = new Shop(req.body);
    shop.save().then(todo => {
            res.status(200).json({ 'message': 'Shop list successfully added ', "shop": shop });
        })
        .catch(err => {
            res.status(400).send("Error when saving to database");
        });
});

app.use('/updateshop', (req, res) => {
    Shop.findByIdAndUpdate({ _id: req.body.data._id }, { items: req.body.data.items }, (err, shopres) => {
        if (err) res.json(err);
        else res.json({ 'message': 'Shop list successfully updated', 'shop': shopres });
    });

});

app.use('/pinShop', (req, res) => {
    Shop.findByIdAndUpdate({ _id: req.body.data._id }, { pinned: req.body.data.pinned }, (err, shopres) => {
        if (err) res.json(err);
        else res.json({ 'message': 'Shop list successfully updated', 'shop': shopres });
    });

});

app.use('/deleteshop', (req, res) => {
    Shop.findByIdAndRemove({ _id: req.body._id }, (err, shopres) =>
        if (err) res.json(err);
        else res.json({ 'message': 'SHop list successfully removed', 'shop': shopres });
    });
});


app.use('/*', express.static(path.join(__dirname, 'dist/index.html')));



const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Server on port ${port}`));