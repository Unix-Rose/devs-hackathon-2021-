const express = require('express');
const CommandSnippet = require('./../schema/command_snippet');
const CodeSnippet = require('./../schema/code_snippet');
const Snippet = require('./../schema/snippet');
const router = express.Router();

// TODO: Rethink where this is mounted
router.get('/new/command', (req, res) => {
    res.render('snippet/new', { snip: new CommandSnippet, title: 'Create Command Snippet' });
});

router.get('/new/code', (req, res) => {
    res.render('snippet/new', { snip: new CodeSnippet, title: 'Create Code Snippet' });
});

async function get_concrete_type_snippet_by_slug(slug) {
    let real = await CommandSnippet.findOne({meta_slug: slug});
    if (real == null) {
        real = await CodeSnippet.findOne({meta_slug: slug});
    }

    return real;
}

async function get_concrete_type_snippet_by_id(id) {
    let real = await CommandSnippet.findById(id);
    if (real == null) {
        real = await CodeSnippet.findById(id);
    }

    return real;
}

router.get('/:slug/edit', async (req, res) => {
    const snip = await get_concrete_type_snippet_by_slug(req.params.slug);
    if (snip == null) res.redirect('/');
    let title = snip.kind === "CodeSnippet" ? "Edit Code Snippet" : "Edit Command Snippet";
    res.render('snippet/edit', { snip: snip, title: title });
});

router.get('/:slug/delete', async (req, res) => {
    const snip = await get_concrete_type_snippet_by_slug(req.params.slug);
    if (snip == null) res.redirect('/');
    res.render('snippet/delete', { snip: snip, title: 'Delete Snippet' });
});

router.get('/:slug', async (req, res) => {
    const snip = await get_concrete_type_snippet_by_slug(req.params.slug);
    res.render('snippet/view', { snip: snip, title: 'Viewing Snippet' });
});

// CREATE
router.post('/', async (req, res, next) => {
    let snip;
    if (req.body.kind === 'CodeSnippet') {
        snip = new CodeSnippet;
    } else if (req.body.kind === 'CommandSnippet') {
        snip = new CommandSnippet;
    } else {
        console.log('Error: Snippet kind not defined');
        res.redirect('/');
    }
    req.snippet = snip;
    next();
}, saveSnippetAndRedirect('snippet/new'));

// UPDATE
router.put('/:id', async (req, res, next) => {
    req.snippet = await get_concrete_type_snippet_by_id(req.params.id); 
    next();
}, saveSnippetAndRedirect('snippet/edit'));

router.delete('/:id', async (req, res, next) => {
    await Snippet.findByIdAndDelete(req.params.id);
    res.redirect('/');
});

function saveSnippetAndRedirect(path) {
    return async (req, res) => {
        let snip = req.snippet;

        snip.title = req.body.title;
        snip.snippet = req.body.snippet;
        snip.tags = req.body.tags.replace(/\s/g,'').split(',');
        snip.category = req.body.category;

        if (snip.kind === 'CodeSnippet') {
            snip.lang = req.body.lang;
        }

        if (snip.kind === 'CommandSnippet') {
            snip.program = req.body.program;
        }
    
        try {
            snip = await snip.save();
            res.redirect(`/snip/${snip.meta_slug}`);
        } catch (e) {
            console.log(e);
            res.render(`${path}`, { snip: snip, title: 'Error: Please Try Again' });
        }
    }
}

module.exports = router;