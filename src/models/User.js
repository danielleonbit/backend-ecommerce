const { Schema, model } = require('mongoose')
const bcrypt = require('bcrypt')
const SALT_I = 10 // SCHEMA
const jwt = require('jsonwebtoken')
const UserSchema = new Schema(
    {
        names_and_lastnames: { type: String, required: true },
        email: { type: String, required: true, index: { unique: true } },
        password: { type: String, required: true },
        image: { type: String, required: true },
        role: {
            type: Number,
            default: 0
        },
        token: {
            type: String
        }

    },
    {
        timestamp: true,
        versionKey: false,
    }
);
UserSchema.pre('save', async function (next) {
    
    if (this.isModified('password')) {
        try {
            const salt = await bcrypt.genSalt(SALT_I)
            const hash = await bcrypt.hash(this.password, salt)
            this.password = hash;
            console.log( this.password)
            next();
        } catch (err) {
            return next(err);
        }
    }
})



UserSchema.methods.comparePassword = function (candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
        if (err) return cb(err)
        cb(null, isMatch)
    })
}
UserSchema.methods.generateToken = async function (cb) {
    const token = await jwt.sign(this._id.toHexString(), process.env.SECRET)
    this.token = token
    this.save((err, user) => {
        if (err) return cb(err)
        cb(null, user)
    })
}
UserSchema.statics.findByToken = function (token, cb) {
    let user = this
    jwt.verify(token, process.env.SECRET, function (err, decode) {
        user.findOne({
            "_id": decode,
            "token": token
        }, function (err, user) {
            if (err) { return cb(error) }
            cb(null, user)
        }
        )
    })

}

module.exports = model("Users", UserSchema)