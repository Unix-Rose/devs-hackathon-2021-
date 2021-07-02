const express = require('express');
const CommandSnippet = require('./../schema/command_snippet');
const CodeSnippet = require('./../schema/code_snippet');
const router = express.Router();

// TODO: Rethink where this is mounted
router.get('/new/command', (req, res) => {
    res.render('snippet/new', { snip: new CommandSnippet, title: 'Create Command Snippet' });
});

router.get('/new/code', (req, res) => {
    res.render('snippet/new', { snip: new CodeSnippet, title: 'Create Code Snippet' });
});

router.get('/:slug', (req, res) => {
    res.send(`Viewing snippet '${req.params.slug}'`);
});

router.post('/', async (req, res, next) => {
    req.snippet = new CommandSnippet();
    next();
}, saveSnippetAndRedirect('/new'));

function saveSnippetAndRedirect(path) {
    return async (req, res) => {
        // TODO CHECK TYPE (Command vs Code)
        let snip = req.snippet;
        snip.title = req.body.title;
        snip.snippet = req.body.snippet;
        snip.tags = req.body.tags.split(',');
        snip.program = req.body.program; // TODO: Only for Command Types
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