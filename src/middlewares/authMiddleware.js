import jwt from 'jsonwebtoken';

// Middleware to verify JWT token
export const authMiddleware = (req, res, next) => {
    try {
        // Kiểm tra header Authorization
        const authHeader = req.header('Authorization');
        if (!authHeader) {
            return res.status(401).json({ message: 'Authorization header is missing' });
        }

        // Kiểm tra format Bearer token
        if (!authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Invalid token format' });
        }

        // Lấy token và loại bỏ 'Bearer '
        const token = authHeader.substring(7);
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Gán thông tin user vào request
        req.user = { id: decoded.userId };
        next();

    } catch (err) {
        console.error('Auth Error:', err.message);
        if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid token' });
        }
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token has expired' });
        }
        res.status(500).json({ message: 'Server authentication error' });
    }
}