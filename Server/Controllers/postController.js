import Post from '../Models/Post.js';  // Import Post model
import cloudinary from '../Cloudinary.js';
import mongoose from 'mongoose';

// Create a new post
export const createPost = async (req, res) => {
    try {
        const { title, content, categoryId, status } = req.body;

        // Kiểm tra dữ liệu đầu vào
        if (!title || !content || !categoryId) {
            return res.status(400).json({ message: 'Title, content, and categoryId are required' });
        }

        // Kiểm tra nếu không có file hình ảnh
        if (!req.file) {
            return res.status(400).json({ message: 'Image is required' });
        }

        // Upload hình ảnh lên Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'posts/',
            use_filename: true,
            unique_filename: true,
        });

        // Tạo bài viết mới
        const newPost = new Post({
            title,
            content,
            categoryId,
            image: result.secure_url, // Lấy URL từ Cloudinary
            status: status || 'visible', // Nếu không có status, mặc định là 'visible'
        });

        // Lưu vào cơ sở dữ liệu
        await newPost.save();

        // Phản hồi thành công
        return res.status(201).json({
            success: true,
            message: 'New post created successfully',
            post: newPost,
        });
    } catch (error) {
        console.error('Error creating post:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error. Please try again.',
            error: error.message,
        });
    }
};


// Lấy tất cả bài viết
export const getPosts = async (req, res) => {
    try {
        // Populate để lấy thông tin danh mục
        const posts = await Post.find().populate('categoryId', 'name description');
        res.status(200).json(posts);
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({
            message: 'Failed to fetch posts',
            error: error.message,
        });
    }
};

// Lấy bài viết theo trạng thái (status)
export const getPostsByStatus = async (req, res) => {
    try {
        const { status } = req.params;

        // Lọc bài viết theo status
        const posts = await Post.find({ status }).populate('categoryId', 'name description');
        if (!posts.length) {
            return res.status(404).json({ message: `No posts found with status ${status}` });
        }

        res.status(200).json(posts);
    } catch (error) {
        console.error('Error fetching posts by status:', error);
        res.status(500).json({
            message: 'Failed to fetch posts by status',
            error: error.message,
        });
    }
};

// Lấy bài viết theo ID
export const getPostById = async (req, res) => {
    try {
        const { id } = req.params;

        const post = await Post.findById(id).populate('categoryId', 'name description');
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        res.status(200).json(post);
    } catch (error) {
        console.error('Error fetching post by ID:', error);
        res.status(500).json({
            message: 'Failed to fetch post',
            error: error.message,
        });
    }
};

// Update a post by ID
export const updatePost = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, categoryId, status } = req.body;

        // Tìm bài viết theo ID
        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Nếu có hình ảnh mới được tải lên, thay đổi ảnh
        if (req.file) {
            const publicId = post.image.split('/').slice(-2).join('/').split('.')[0]; // Extract public_id từ URL
            await cloudinary.uploader.destroy(publicId); // Xóa hình ảnh cũ
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: 'posts/',
                use_filename: true,
                unique_filename: true,
            });
            post.image = result.secure_url; // Cập nhật URL hình ảnh mới
        }

        // Cập nhật thông tin khác
        if (title) post.title = title;
        if (content) post.content = content;
        if (categoryId) post.categoryId = categoryId;
        if (status) post.status = status;  // Cập nhật trạng thái bài viết

        // Lưu thay đổi
        await post.save();

        return res.status(200).json({
            success: true,
            message: 'Post updated successfully',
            post,
        });
    } catch (error) {
        console.error('Error updating post:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error. Please try again.',
            error: error.message,
        });
    }
};

// Lấy bài viết theo danh mục
export const getPostsByCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;

        const posts = await Post.find({ categoryId }).populate('categoryId', 'name description');
        if (!posts.length) {
            return res.status(404).json({ message: 'No posts found for this category' });
        }

        res.status(200).json(posts);
    } catch (error) {
        console.error('Error fetching posts by category:', error);
        res.status(500).json({
            message: 'Failed to fetch posts by category',
            error: error.message,
        });
    }
};

// Lấy bài viết theo danh mục và trạng thái
export const getPostsByCategoryAndStatus = async (req, res) => {
    try {
        const { categoryId, status } = req.params;

        // Lọc bài viết theo danh mục và status
        const posts = await Post.find({ categoryId, status }).populate('categoryId', 'name description');
        if (!posts.length) {
            return res.status(404).json({ message: 'No posts found for this category and status' });
        }

        res.status(200).json(posts);
    } catch (error) {
        console.error('Error fetching posts by category and status:', error);
        res.status(500).json({
            message: 'Failed to fetch posts by category and status',
            error: error.message,
        });
    }
};



