const express = require('express');
const mongoose = require('mongoose');
const Snippet = require('./schema/snippet');
const CommandSnippet = require('./schema/command_snippet');
const CodeSnippet = require('./schema/code_snippet');
const snipRouter = require('./routes/snip_router');
const tagRouter = require('./routes/tag_router');
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
    
    let snippets = await Snippet.find().sort('-meta_date_modified');
    let searchQuery = req.query.q;
    let searchCode = (req.query.excludeSearchCode == undefined);
    let searchCommand = (req.query.excludeSearchCommand == undefined);
    console.log(searchCode);
    console.log(searchCommand);
    snippets = await search(searchQuery, searchCode, searchCommand);

    res.render('index', { snippets: snippets, searchQuery: searchQuery, excludeSearchCode: !searchCode, excludeSearchCommand: !searchCommand });
});

async function search(searchQuery, searchCode, searchCommand) {
    
    // Get all snippets
    let snippets = [];
    if (searchCode) {
        const codeSnippets = await CodeSnippet.find();
        snippets = snippets.concat(codeSnippets);
    }
    if (searchCommand) {
        const commandSnippets = await CommandSnippet.find();
        snippets = snippets.concat(commandSnippets);
    }

    let results = snippets;

    if (searchQuery != null && searchQuery != undefined) {
        // Perform full text search
        var idx = lunr(function () {
            this.field('title');
            this.field('snippet');
            this.field('tags');
            this.field('category');
            this.field('program');
            this.field('lang');

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
app.use('/tag', tagRouter);

app.listen(5000);