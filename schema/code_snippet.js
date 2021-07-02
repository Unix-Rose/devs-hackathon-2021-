const mongoose = require('mongoose');
const Snippet = require('./snippet');

const codeSnippetSchema = new mongoose.Schema({
    language: {
        type: String,
        required: true
    },
    category: {
        type: String
    },
});

codeSnippetSchema.pre('validate', function(next) {
    if (this.title && this.language) {
        this.meta_slug = slugify(this.language + ' ' + this.title, { lower: true, strict: true });
    }

    next();
});

module.exports = Snippet.discriminator('CodeSnippet', codeSnippetSchema);