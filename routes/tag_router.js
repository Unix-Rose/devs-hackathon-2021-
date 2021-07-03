const express = require('express');
const CommandSnippet = require('./../schema/command_snippet');
const CodeSnippet = require('./../schema/code_snippet');
const Snippet = require('./../schema/snippet');
const router = express.Router();

router.get('/:tag', async (req, res) => {
    var tag = req.params.tag;
    var snippets = await Snippet.find({ "tags": tag });
    res.render('tag', { tag: tag, snippets: snippets });
});

module.exports = router;