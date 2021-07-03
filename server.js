const express = require('express');
const mongoose = require('mongoose');
const Snippet = require('./schema/snippet');
const CommandSnippet = require('./schema/command_snippet');
const CodeSnippet = require('./schema/code_snippet');
const snipRouter = require('./routes/snip_router');
const methodOverride = require('method-override');

// lunr search
const lunr = require('lunr');

mongoose.connect('mongodb://localhost/snippets', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true});

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(express.static(__dirname + '/public'))

app.set('view engine', 'ejs');

app.get('/', async (req, res) => {
    
    // TODO: Fill the search bar with current query
    let snippets = await Snippet.find().sort({ meta_date: 'desc' });
    let searchQuery = req.query.q;
    snippets = await search(searchQuery);

    res.render('index', { snippets: snippets, searchQuery: searchQuery });
});

async function search(searchQuery) {
    
    // Get all snippets
    const snippets = await Snippet.find();
    let results = snippets;

    console.log(searchQuery);
    if (searchQuery != null && searchQuery != undefined) {
        // Perform full text search
        var idx = lunr(function () {
            this.field('title');
            this.field('snippet');
            this.field('tags');
            this.field('category');
            this.field('program');
            this.field('language');

            this.ref('_index');
        
            let i = 0;
            snippets.forEach(s => {
                s._index = i;
                this.add(s);

                i++;
            });
        });

        const searchRefs = idx.search(searchQuery);

        // TODO: Highlighting
        results = new Array();
        searchRefs.forEach(async res => {
            results.push(snippets[res.ref]);
        });
    }

    return results;
}

app.use('/snip', snipRouter);

app.listen(5000);