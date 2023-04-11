const mongoose = require('mongoose');

const Poem = new mongoose.Schema({
    name: {
        type: String,
    },
    price: {
        type: Number,
    },
    quantity: {
        type: Number,
    },
    color:{
        type:String,
    },
    img: {
        data:Buffer,
        type: String,
    },
})
module.exports = mongoose.model('Product', Poem);
