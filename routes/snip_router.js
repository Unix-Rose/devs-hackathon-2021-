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

async function get_concrete_type_snippet(slug) {
    let real = await CommandSnippet.findOne({meta_slug: slug});
    if (real == null) {
        real = await CodeSnippet.findOne({meta_slug: slug});
    }

    return real;
}

router.get('/:slug/edit', async (req, res) => {
    const snip = await get_concrete_type_snippet(req.params.slug);
    if (snip == null) res.redirect('/');
    let title = snip.kind === "CodeSnippet" ? "Edit Code Snippet" : "Edit Command Snippet";
    res.render('snippet/edit', { snip: snip, title: title });
});

router.get('/:slug', async (req, res) => {
    const snip = await get_concrete_type_snippet(req.params.slug);
    res.render('snippet/view', { snip: snip, title: 'Viewing Snippet' });
});

router.post('/', saveSnippetAndRedirect('/new'));

function saveSnippetAndRedirect(path) {
    return async (req, res) => {
        let snip;
        if (req.body.kind === 'CodeSnippet') {
            snip = new CodeSnippet;
            snip.language = req.body.language;
            
        } else if (req.body.kind === 'CommandSnippet') {
            snip = new CommandSnippet;
            snip.program = req.body.program;

        } else {
            throw Error('Snippet Kind not defined');
        }

        snip.title = req.body.title;
        snip.snippet = req.body.snippet;
        snip.tags = req.body.tags.split(',');
        snip.category = req.body.category;
    
        try {
            snip = await snip.save();
            res.redirect(`/snip/${snip.meta_slug}`);
        } catch (e) {
            console.log(e);
            res.render(`${path}`, { snip: snip });
        }
    }
}

module.exports = router;