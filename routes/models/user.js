const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    passwordHash: {
        type: String,
        required: true
    },
    registeredDate: {
        type: Date,
        required: true,
        default: Date.now
    }
});

userSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (req, res) {
        delete res._id;
        delete res.passwordHash;
    }
});

module.exports = mongoose.model('User', userSchema);