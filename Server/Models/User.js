import mongoose from 'mongoose';

// Define course schema
const userSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
});

// Export the model
export default mongoose.model('User', userSchema);
