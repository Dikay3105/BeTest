// Import dependencies
import express from 'express';
import mongoose from 'mongoose';
import logger from 'morgan';
import dotenv from 'dotenv';
import cors from 'cors';
import mainRoutes from './Server/Routes/Main.js';

// Load environment variables from .env file
dotenv.config();

// Set up dependencies
const app = express();

// Middleware để parse JSON và URL encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Cấu hình CORS để cho phép frontend từ các domain khác gửi yêu cầu
app.use(cors({
    origin: 'http://localhost:3000',  // Cho phép frontend trên localhost:3000
    methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Các phương thức được phép
    allowedHeaders: ['Content-Type', 'Authorization'],  // Các header được phép
}));

// Sử dụng morgan để log requests
app.use(logger('dev'));

// Set up mongoose connection
const mongoURI = process.env.MONGO_URI;

async function connectDB() {
    try {
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Database connected');
    } catch (error) {
        console.error('Error connecting to database:', error.message);
        process.exit(1);  // Dừng server nếu kết nối thất bại
    }
}
connectDB();

// Set up port
const port = process.env.PORT || 5035;  // Lấy port từ .env hoặc mặc định là 5035

// Set up route for main API
app.use('/api', mainRoutes);

// Set up default route
app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Welcome to Project with Nodejs, Express, and MongoDB',
    });
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
