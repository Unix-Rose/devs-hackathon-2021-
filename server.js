const express = require('express');


const app = express();

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('views/')
});

app.listen(5000);