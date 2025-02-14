const mongoose = require('mongoose');
const { number } = require('zod');

mongoose.connect("mongodb+srv://mandeep:IohOFa3hYeqZMyzU@personaluse.uzcky.mongodb.net/paytm");

        
// backend/db.js

// Create a Schema for Users
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minLength: 3,
        maxLength: 30
    },
    password: {
        type: String,
        required: true,
        minLength: 6
    },
    firstname: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    },
    lastname: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    }
});

//schema for user account balances
const accountbalancesschema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,  // refrence to user model 
        ref: 'User',
        required: true 
    },
    balance: {
        type: Number,
        required: true,
    }
})

// Create a model from the schema
const User = mongoose.model('User', userSchema);
const Account = mongoose.model('Account', accountbalancesschema);

module.exports = {
	User,
    Account,
};
