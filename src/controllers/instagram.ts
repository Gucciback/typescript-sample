let mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const InstagramSchema = new Schema({
    message_id: { type: String, required: true },
});

module.exports = mongoose.model('Instagram', InstagramSchema);