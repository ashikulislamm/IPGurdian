import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  country: { type: String, required: true },
  address: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  password: { type: String, required: true },
  walletAddress: { 
    type: String, 
    default: null,
    unique: true,
    sparse: true, // Allows multiple null values but unique non-null values
    lowercase: true,
    validate: {
      validator: function(v) {
        if (!v) return true; // Allow null/undefined
        return /^0x[a-fA-F0-9]{40}$/.test(v); // Ethereum address format
      },
      message: props => `${props.value} is not a valid Ethereum address!`
    }
  },
  walletLinkedAt: { type: Date, default: null },
}, {
  timestamps: true
});

export default mongoose.model("User", userSchema);
