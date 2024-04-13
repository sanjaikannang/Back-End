import  mongoose from 'mongoose';

const userSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true
  },

  password: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
  },

  count: {
    type: Number,
    default: 0
  },

  gender: {
    type: String,
    enum: ['Male', 'Female']
  },

  lastLoginDate: {
    type: Date,
    default: Date.now
  }

});

export default mongoose.model("User", userSchema);