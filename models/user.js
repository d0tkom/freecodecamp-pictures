var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var userSchema = new Schema({
	twitter: {
		id: String,
		displayName: String,
		username: String
	},
	dateAdded: { type: 'Date', default: Date.now, required: true },
});

module.exports = mongoose.model('User', userSchema);
