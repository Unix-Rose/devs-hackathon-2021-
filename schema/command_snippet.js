const mongoose = require('mongoose');
const Snippet = require('./snippet');
const slugify = require('slugify');

const commandSnippetSchema = new mongoose.Schema({
    program: {
        type: String,
        required: true
    },
    category: {
        type: String
    },
});

commandSnippetSchema.pre('validate', function(next) {
    if (this.title && this.program) {
        this.meta_slug = slugify(this.program + ' ' + this.title, { lower: true, strict: true });
    }

    next();
});

module.exports = Snippet.discriminator('CommandSnippet', commandSnippetSchema);