var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var pictureSchema = new Schema({
    url: { type: 'String', required: true },
    dateAdded: { type: 'Date', default: Date.now, required: true },
    userId: { type: 'String', required: true},
    userName: {type: 'String', required: true}
});

module.exports = mongoose.model('Picture', pictureSchema);
