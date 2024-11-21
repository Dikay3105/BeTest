import Post from '../Models/Post.js';  // Import Post model
import cloudinary from '../Cloudinary.js';
import mongoose from 'mongoose';

// Create a new post
export const createPost = async (req, res) => {
    try {
        const { title, content } = req.body;

        // Kiểm tra nếu có tệp hình ảnh được gửi lên
        if (!req.file) {
            return res.status(400).json({ message: 'Image is required' });
        }

        // Upload hình ảnh lên Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'posts/', // Đặt folder trên Cloudinary nếu muốn
            use_filename: true,  // Sử dụng tên tệp gốc
            unique_filename: true  // Đảm bảo tên tệp là duy nhất
        });

        // Lấy URL của hình ảnh đã tải lên
        const imageUrl = result.secure_url;

        // Tạo bài viết mới với thông tin đã nhận và URL hình ảnh
        const newPost = new Post({
            title,
            content,
            image: imageUrl,  // Lưu URL hình ảnh từ Cloudinary
        });

        // Lưu bài viết vào cơ sở dữ liệu
        await newPost.save();

        // Trả về phản hồi thành công
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
        const posts = await Post.find();
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch posts', error: error.message });
    }
};

// Lấy bài viết theo ID
export const getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch post', error: error.message });
    }
};

// Update a post by ID
export const updatePost = async (req, res) => {
    try {
        const { id } = req.params; // Lấy ID bài viết từ URL
        const { title, content } = req.body;

        // Tìm bài viết theo ID
        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Nếu có hình ảnh mới được gửi lên, cập nhật hình ảnh
        if (req.file) {
            // Xóa hình ảnh cũ khỏi Cloudinary
            const publicId = post.image.split('/').slice(-2).join('/').split('.')[0]; // Lấy `public_id` từ URL
            await cloudinary.uploader.destroy(publicId);

            // Upload hình ảnh mới lên Cloudinary
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: 'posts/',
                use_filename: true,
                unique_filename: true,
            });

            post.image = result.secure_url; // Cập nhật URL hình ảnh mới
        }

        // Cập nhật tiêu đề và nội dung (nếu được gửi lên)
        if (title) post.title = title;
        if (content) post.content = content;

        // Lưu các thay đổi vào cơ sở dữ liệu
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

