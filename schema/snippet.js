const mongoose = require('mongoose');

var options = { discriminatorKey: 'kind', collection: 'snippets' };

const snippetSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    snippet: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    tags: [{
        type: String
    }],
    meta_html_sanitised: {
        type: String,
        required: true
    },
    meta_date_modified: {
        type: Date,
        required: true,
        default: new Date()
    },
    meta_slug: {
        type: String,
        required: true,
        unique: true
    }
}, options);

snippetSchema.pre('validate', function(next) {
    // Can be overriden in derived schema
    if (this.title) {
        this.meta_slug = slugify(this.title, { lower: true, strict: true });
    }

    if (this.description) {
        this.meta_html_sanitised = dompurify.sanitize(marked(this.description));
    }

    next();
});

module.exports = mongoose.model('Snippet', snippetSchema);