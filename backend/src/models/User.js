const mongoose = require('mongoose');

const schema = new mongoose.Schema({}, {timestamps: true})

const User = mongoose.models.User || mongoose.model('User',schema)

module.exports = { User };
