/* eslint-disable import/no-mutable-exports */

import mongoose, { Schema } from 'mongoose';
import { hashSync, compareSync } from 'bcrypt-nodejs';
import Place from './place.model';
import jwt from 'jsonwebtoken';
import uniqueValidator from 'mongoose-unique-validator';
import { filteredBody } from '../utils/filteredBody';

import constants from '../config/constants';

const UserSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      required: [true, 'Email is required!'],
      trim: true,
      index: true,
      validate: {
        validator(email) {
          const emailRegex = /^[-a-z0-9%S_+]+(\.[-a-z0-9%S_+]+)*@(?:[a-z0-9-]{1,63}\.){1,125}[a-z]{2,63}$/i;
          return emailRegex.test(email);
        },
        message: '{VALUE} is not a valid email!',
      },
    },
    username: {
      type: String,
      required: [true, 'Username is required'],
      trim: true,
      unique: true,
      index: true
    },
    password: {
      type: String,
      required: [true, 'Password is required!'],
      trim: true,
      minlength: [6, 'Password need to be longer!'],
      validate: {
        validator(password) {
          return password.length >= 6 && password.match(/\d+/g);
        },
      },
    },
  },
  { timestamps: true },
);

const filleable = [ 'email', 'password', 'username' ];

UserSchema.virtual('places').get(function() {
  return Place.find({ user: this._id });
});

UserSchema.plugin(uniqueValidator, {
  message: '{VALUE} already taken!',
});

// Hash the user password on creation
UserSchema.pre('save', function(next) {
  if (this.isModified('password')) {
    this.password = this._hashPassword(this.password);
    return next();
  }
  return next();
});

UserSchema.methods = {
  authenticateUser(password) {
    return compareSync(password, this.password);
  },
  _hashPassword(password) {
    return hashSync(password);
  },
  createToken() {
    return jwt.sign(
      {
        _id: this._id,
      },
      constants.JWT_SECRET,
    );
  },
  toAuthJSON() {
    return {
      _id: this._id,
      token: `JWT ${this.createToken()}`
    };
  },
  toJSON() {
    return {
      id: this._id,
      email: this.email,
      username: this.username
    };
  },
};


UserSchema.statics = {
  createUser(params) {
    return this.create({
     ...filteredBody(params, filleable)
    });
  }
}

let User;

try {
  User = mongoose.model('User');
} catch (e) {
  User = mongoose.model('User', UserSchema);
}

export default User;
