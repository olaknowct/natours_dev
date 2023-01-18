const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name!'],
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  photo: String,
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      // validate only returns true/false: true - valid, false - invalid
      // This only works on create/save not on find one or update
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords are not the same!',
    },
  },
  passwordChangedAt: Date,
});

userSchema.pre('save', async function (next) {
  // only updating and creating cred encrypt pass happens
  // only run this function if pass was actually modified
  if (!this.isModified('password')) return;

  // hash/encrypt the password with cost of 12
  // 2nd argument - cost paramater. the higher the better encryption and the more cpu intesive, higher then more time
  // hash is async
  this.password = await bcrypt.hash(this.password, 12);

  // delete confirm password - so that it will not persisted on database
  // validator runs first before userschema pre
  this.passwordConfirm = undefined;
  next();
});

// instance method - available on all documents of a certain collection
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  // this keyword points to the current object
  // this.password is not available since we falsely selected
  return await bcrypt.compare(candidatePassword, userPassword);
};

// isntance method - available to all documents, docs are instances of a model
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    // compare
    // 100 < 200 - true : changed | 200 < 100 -false : password not changed
    // if recently changes return true, if password no changes return false
    return JWTTimestamp < changedTimeStamp;
  }

  // by default false - not changed
  return false;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
