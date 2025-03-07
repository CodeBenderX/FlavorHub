import mongoose from 'mongoose'
import crypto from 'crypto'
//const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: 'Name is required'
    },
    email: {
        type: String,
        trim: true,
        unique: 'Email already exists',
        match: [/.+\@.+\..+/, 'Please fill a valid email address'],
        required: 'Email is required'
    },
    created: {
        type: Date,
        default: Date.now
    },
    updated: {
        type: Date,
        default: Date.now
    },
    securityQuestion: { 
        type: String, 
        required: true, 
      },
      securityAnswer: { 
        type: String, 
        required: 'Password is required', 
      },
      admin: { 
        type: Boolean, 
        default: false 
    },
    // role: {
    //     type: String,
    //     enum: ['user', 'admin'],
    //     default: 'user'
    //   },
    hashed_password: {
        type: String,
        required: 'Password is required'
    },
    // New field to store the salt for the security answer
    securityAnswerSalt: String,
    salt: String
});
UserSchema.virtual('password')
    .set(function (password) {
        this._password = password;
        this.salt = this.makeSalt();
        this.hashed_password = this.encryptPassword(password)
        //this.hashed_password = password;
        //this.hashed_password = this.encryptPassword(password);
    })
    .get(function () {
        return this._password;
    });

// New virtual for security answer (plain text input)
UserSchema.virtual('securityAnswerPlain')
    .set(function (plainAnswer) {
        this._securityAnswer = plainAnswer;
        // Generate a salt specifically for the security answer
        this.securityAnswerSalt = this.makeSalt();
        // Hash and store the security answer
        this.securityAnswer = this.encryptSecurityAnswer(plainAnswer);
    })
    .get(function () {
        return this._securityAnswer;
    });

UserSchema.path('hashed_password').validate(function (v) {
    if (this._password && this._password.length < 6) {
        this.invalidate('password', 'Password must be at least 6 characters.');
    }
    if (this.isNew && !this._password) {
        this.invalidate('password', 'Password is required');
    }
}, null);
UserSchema.methods = {
    authenticate: function (plainText) {
        return this.encryptPassword(plainText) === this.hashed_password
    },
    encryptPassword: function (password) {
        if (!password) return ''
        try {
            return crypto
                .createHmac('sha1', this.salt)
                .update(password)
                .digest('hex')
        } catch (err) {
            return ''
        }
    },
    // Method to verify a provided security answer
    authenticateSecurityAnswer: function (plainAnswer) {
        return this.encryptSecurityAnswer(plainAnswer) === this.securityAnswer;
    },
     // New method to hash the security answer using its dedicated salt
     encryptSecurityAnswer: function (answer) {
        if (!answer) return '';
        try {
            const normalized = answer.trim().toLowerCase();
            return crypto
                .createHmac('sha1', this.securityAnswerSalt)
                .update(normalized)
                .digest('hex');
        } catch (err) {
            return '';
        }
    },
    makeSalt: function () {
        return Math.round((new Date().valueOf() * Math.random())) + ''
    }
}
//module.exports = mongoose.model('User', UserSchema);
export default mongoose.model('User', UserSchema);
