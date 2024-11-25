import mongoose from 'mongoose'; // Import mongoose

// Define the schema for Category
const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true, // Name of the category is required
        unique: true,   // Category name should be unique
    },
    description: {
        type: String,   // Optional description for the category
    },
}, { timestamps: true }); // Timestamps will automatically add createdAt and updatedAt fields

// Create the model for the Category schema
const Category = mongoose.model('Category', categorySchema);

// Export the model for use in other parts of the application
export default Category;
