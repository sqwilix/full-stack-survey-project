import mongoose from "mongoose";
import validator from 'validator'

const UserSchema = new mongoose.Schema({
    name: {type: String, required: true, minlength: 3, maxlength: 15,},
    password: {type: String, required: true, minlength: 3, maxlength: 100, select: false},
    email: {type: String, required: true, unique: true, validate: validator.isEmail},
    role: {type: String, enum: ['user', 'admin'], default: 'user'},
    avatar: {type: String, default: 'https://uxwing.com/wp-content/themes/uxwing/download/peoples-avatars/default-avatar-profile-picture-male-icon.png'},
    refreshToken: {type: String, default: ''},
}, {timestamps: true})

export default mongoose.model('User', UserSchema)