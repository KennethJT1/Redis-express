const {Schema, model} = require('mongoose')

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        min: 6, 
        max: 255
    },
    password: {
        type: String,
        required: true
    }
})

module.exports = model("User", userSchema)