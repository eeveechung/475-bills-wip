var mongoose = require('mongoose');


var billSchema = new mongoose.Schema({
	bill_name 		:String,
	amount 			:Number,
	date			:String,
	user_name		:String,
	obsolete		:String,
	active			:Boolean
});

module.exports = mongoose.model('Bill', billSchema);