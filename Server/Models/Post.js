import mongoose from 'mongoose'; // Import mongoose

// Define the schema for Post
const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true  // Title is required
    },
    image: {
        type: String,  // We will store the URL of the image
        required: true // Image URL is required
    },
    content: {
        type: String,  // Content will be stored as HTML
        required: true // Content is required
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId, // Reference to Category
        ref: 'Category',  // Model name to relate with
        required: true    // Category is required for a post
    },
    status: {
        type: String,  // Status of the post
        enum: ['hidden', 'visible'], // Only allow these two values
        default: 'visible' // Default value is 'visible'
    }
}, { timestamps: true });  // Timestamps will automatically add createdAt and updatedAt fields

// Create the model for the Post schema
const Post = mongoose.model('Post', postSchema);

// Export the model for use in other parts of the application
export default Post;
