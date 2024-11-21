import mongoose from 'mongoose';
import User from '../Models/User.js';

// Create new user
export async function createUser(req, res) {
    try {
        const user = new User({
            _id: new mongoose.Types.ObjectId(), // Create a new ObjectId
            name: req.body.name,
            email: req.body.email,
        });

        const newUser = await user.save();
        return res.status(201).json({
            success: true,
            message: 'New user created successfully',
            course: newUser,
        });
    } catch (error) {
        console.error('Error creating course:', error); // Log error for debugging
        return res.status(500).json({
            success: false,
            message: 'Server error. Please try again.',
            error: error.message,
        });
    }
}

// Get all users
export async function getAllUser(req, res) {
    try {
        const allUser = await User.find().select('_id name email');
        return res.status(200).json({
            success: true,
            message: 'A list of all Users',
            courses: allUser,
        });
    } catch (error) {
        console.error('Error fetching courses:', error); // Log error for debugging
        return res.status(500).json({
            success: false,
            message: 'Server error. Please try again.',
            error: error.message,
        });
    }
}

// get single user by ID
export async function getSingleUser(req, res) {
    try {
        const id = req.params.userId;
        const singleUser = await User.findById(id);

        res.status(200).json({
            success: true,
            message: `More on ${singleUser.name}`,
            Course: singleUser,
        });
    } catch (error) {
        console.error('Error fetching course:', error); // Log error for debugging
        return res.status(500).json({
            success: false,
            message: 'Server error. Please try again.',
            error: error.message,
        });
    }
}

// Delete a single user by ID
export async function deleteUser(req, res) {
    try {
        const id = req.params.userId;
        const singleUser = await User.findByIdAndDelete(id);

        if (!singleUser) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        return res.status(200).json({
            success: true,
            message: `More on ${singleUser.name}`,
            course: singleUser,
        });
    } catch (error) {
        console.error('Error fetching course:', error); // Log error for debugging
        return res.status(500).json({
            success: false,
            message: 'Server error. Please try again.',
            error: error.message,
        });
    }
}

// Update a single user by ID
export async function updateCourse(req, res) {
    try {
        const id = req.params.userId;
        const updateObject = req.body;

        const updatedCourse = await User.findByIdAndUpdate(
            id,
            { $set: updateObject }, // Chỉ cập nhật các trường được truyền vào
            { new: true } // Trả về document đã cập nhật
        );

        if (!updatedCourse) {
            return res.status(404).json({
                success: false,
                message: 'Course not found',
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Course updated successfully',
            course: updatedCourse,
        });
    } catch (error) {
        console.error('Error updating course:', error); // Log error for debugging
        return res.status(500).json({
            success: false,
            message: 'Server error. Please try again.',
            error: error.message,
        });
    }
}
