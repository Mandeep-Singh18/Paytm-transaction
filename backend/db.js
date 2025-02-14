const mongoose = require('mongoose');
const { number } = require('zod');
require('dotenv').config();

const mongoURI = process.env.MONGODB_URI;

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

        
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
