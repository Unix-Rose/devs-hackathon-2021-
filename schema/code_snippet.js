const mongoose = require('mongoose');
const Snippet = require('./snippet');
const slugify = require('slugify');

const codeSnippetSchema = new mongoose.Schema({
    lang: {
        type: String,
        required: true
    }
});

codeSnippetSchema.pre('validate', function(next) {
    if (this.title && this.lang) {
        this.meta_slug = slugify(this.lang + ' ' + this.title, { lower: true, strict: true });
    }

    next();
});

module.exports = Snippet.discriminator('CodeSnippet', codeSnippetSchema);