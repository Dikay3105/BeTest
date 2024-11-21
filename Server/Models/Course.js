import mongoose from 'mongoose';

// Define course schema
const courseSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
});

// Export the model
export default mongoose.model('Course', courseSchema);
