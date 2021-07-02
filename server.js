const express = require('express');

const app = express();

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.send('Hack Overflow :)');
});

app.listen(5000);