const express = require('express');
const CommandSnippet = require('./../schema/command_snippet');
const router = express.Router();

// TODO: Rethink where this is mounted
router.get('/command/new', (req, res) => {
    res.render('command/new', { snip: new CommandSnippet });
});

router.get('/:slug', (req, res) => {

});

router.post('/command', async (req, res, next) => {
    req.snippet = new CommandSnippet();
    next();
}, saveSnippetAndRedirect('command/new'));

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