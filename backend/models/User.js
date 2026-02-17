const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  avatar: { type: String ,select:true},
  email: { type: String, required: true, unique: true },
  emailHash: { type: String, unique: true },
  password: { type: String, required: true },
  lastactive: { type: Date, default: Date.now },
  isEmailVerified: { type: Boolean, default: false },
  emailOtp: String,
  emailOtpExpire: Date,
  createdAt: { type: Date, default: Date.now },
  wallpaper:{type:String ,select :true}
});

userSchema.pre('save', function () {
  if (this.email) {
    this.emailHash = crypto.createHash('sha256').update(this.email).digest('hex');
  }
});

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
