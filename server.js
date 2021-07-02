const express = require('express');
const mongoose = require('mongoose');
const Snippet = require('./schema/snippet');
const CommandSnippet = require('./schema/command_snippet');
const CodeSnippet = require('./schema/code_snippet');
const snipRouter = require('./routes/snip_router');

mongoose.connect('mongodb://localhost/snippets', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true});

const app = express();

app.use(express.urlencoded({ extended: false }));

app.set('view engine', 'ejs');

app.get('/', async (req, res) => {
    // var snip = new CommandSnippet();
    // snip.title = "Unzip a gzip tar file";
    // snip.snippet = "tar -xzvf file_name.tar";
    // snip.description = "Extract a gzipped tar file archive";
    // snip.tags = ["tar", "gzip", "extract"];
    // snip.program = "tar";

    const snippets = await Snippet.find().sort({ meta_date: 'desc' });

    res.render('index', { snippets: snippets });
});

app.use('/snip', snipRouter);

app.listen(5000);