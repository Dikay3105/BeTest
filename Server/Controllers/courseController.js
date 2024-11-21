import mongoose from 'mongoose';
import Course from '../Models/Course.js';

// Create new course
export async function createCourse(req, res) {
    try {
        const course = new Course({
            _id: new mongoose.Types.ObjectId(), // Create a new ObjectId
            title: req.body.title,
            description: req.body.description,
        });

        const newCourse = await course.save();
        return res.status(201).json({
            success: true,
            message: 'New course created successfully',
            course: newCourse,
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

// Get all courses
export async function getAllCourse(req, res) {
    try {
        const allCourses = await Course.find().select('_id title description');
        return res.status(200).json({
            success: true,
            message: 'A list of all courses',
            courses: allCourses,
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

// get single course by ID
export async function getSingleCourse(req, res) {
    try {
        const id = req.params.courseId;
        const singleCourse = await Course.findById(id);

        res.status(200).json({
            success: true,
            message: `More on ${singleCourse.title}`,
            Course: singleCourse,
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

// Delete a single course by ID
export async function deleteCourse(req, res) {
    try {
        const id = req.params.courseId;
        const singleCourse = await Course.findByIdAndDelete(id);

        if (!singleCourse) {
            return res.status(404).json({
                success: false,
                message: 'Course not found',
            });
        }

        return res.status(200).json({
            success: true,
            message: `More on ${singleCourse.title}`,
            course: singleCourse,
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

// Update a single course by ID
export async function updateCourse(req, res) {
    try {
        const id = req.params.courseId;
        const updateObject = req.body;

        const updatedCourse = await Course.findByIdAndUpdate(
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
