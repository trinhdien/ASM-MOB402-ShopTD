const mongoose = require('mongoose');

const Poem = new mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
    },
    password: {
        type: String,
    },
    img: {
        data:Buffer,
        type: String,
    },
    permission:{
        type: String,
    },
    status:{
        type:Boolean,
    }
})
module.exports = mongoose.model('User', Poem);