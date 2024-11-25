import express from 'express';
// import { createCourse, deleteCourse, getAllCourse, getSingleCourse } from '../Controllers/courseController.js';
import multer from 'multer';
import path from 'path';
import { createPost, getPosts, getPostById, updatePost, getPostsByCategory } from '../Controllers/postController.js';
import { createCategory, deleteCategory, getCategories, getCategoryById, updateCategory } from '../Controllers/categoryController.js';

const router = express.Router();
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');  // Lưu tệp vào thư mục tạm thời
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));  // Đảm bảo tên tệp duy nhất
    }
});

const upload = multer({ storage: storage });

// Define routes
// router.post('/courses', createCourse);
// router.get('/courses', getAllCourse);
// router.get('/courses/:courseId', getSingleCourse);
// router.delete('/courses/:courseId', deleteCourse);


// Route để tạo bài viết mới
router.post('/posts', upload.single('image'), createPost);
// Route để lấy tất cả bài viết
router.get('/posts', getPosts);
// Route để lấy bài viết theo ID
router.get('/posts/:id', getPostById);
// Routes cho bài viết theo danh mục
router.get('/posts/category/:categoryId', getPostsByCategory);


// Routes cho danh mục (Category)
router.post('/categories', createCategory);
router.get('/categories', getCategories);
router.get('/categories/:id', getCategoryById);
router.put('/categories/:id', updateCategory);
router.delete('/categories/:id', deleteCategory);




router.put('/:id', upload.single('image'), updatePost);
export default router;
