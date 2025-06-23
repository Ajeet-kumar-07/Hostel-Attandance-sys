const mongoose = require('mongoose');
const mongo = mongoose.mongo;


const userSchema = new mongoose.Schema({
    username:{type:String , unique : true},
    password : {
        type:String
    },
});

module.exports = mongoose.model('User', userSchema);
