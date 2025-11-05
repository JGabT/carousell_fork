import express from 'express';
import db from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all conversations for a user
router.get('/conversations', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get unique conversations with the most recent message
    const [conversations] = await db.query(
      `SELECT 
        CASE 
          WHEN m.sender_id = ? THEN m.receiver_id 
          ELSE m.sender_id 
        END as other_user_id,
        u.username as other_user_name,
        u.profile_picture_url as other_user_picture,
        MAX(m.created_at) as last_message_time,
        (SELECT message FROM messages m2 
         WHERE (m2.sender_id = ? AND m2.receiver_id = other_user_id) 
            OR (m2.receiver_id = ? AND m2.sender_id = other_user_id)
         ORDER BY m2.created_at DESC LIMIT 1) as last_message,
        SUM(CASE WHEN m.receiver_id = ? AND m.is_read = 0 THEN 1 ELSE 0 END) as unread_count
      FROM messages m
      JOIN users u ON u.id = CASE 
        WHEN m.sender_id = ? THEN m.receiver_id 
        ELSE m.sender_id 
      END
      WHERE m.sender_id = ? OR m.receiver_id = ?
      GROUP BY other_user_id, u.username, u.profile_picture_url
      ORDER BY last_message_time DESC`,
      [userId, userId, userId, userId, userId, userId, userId]
    );
    
    res.json(conversations);
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({ message: 'Error fetching conversations' });
  }
});

// Get messages between two users
router.get('/messages/:otherUserId', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const otherUserId = req.params.otherUserId;
    
    const [messages] = await db.query(
      `SELECT m.*, 
        sender.username as sender_name,
        sender.profile_picture_url as sender_picture,
        receiver.username as receiver_name,
        receiver.profile_picture_url as receiver_picture
      FROM messages m
      JOIN users sender ON m.sender_id = sender.id
      JOIN users receiver ON m.receiver_id = receiver.id
      WHERE (m.sender_id = ? AND m.receiver_id = ?) 
         OR (m.sender_id = ? AND m.receiver_id = ?)
      ORDER BY m.created_at ASC`,
      [userId, otherUserId, otherUserId, userId]
    );
    
    // Mark messages as read
    await db.query(
      'UPDATE messages SET is_read = 1 WHERE sender_id = ? AND receiver_id = ? AND is_read = 0',
      [otherUserId, userId]
    );
    
    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Error fetching messages' });
  }
});

// Send a message
router.post('/messages', authenticateToken, async (req, res) => {
  try {
    const senderId = req.user.id;
    const { receiverId, message, productId } = req.body;
    
    if (!receiverId || !message) {
      return res.status(400).json({ message: 'Receiver ID and message are required' });
    }
    
    const [result] = await db.query(
      'INSERT INTO messages (sender_id, receiver_id, message, product_id) VALUES (?, ?, ?, ?)',
      [senderId, receiverId, message, productId || null]
    );
    
    // Get the inserted message with user details
    const [messages] = await db.query(
      `SELECT m.*, 
        sender.username as sender_name,
        sender.profile_picture_url as sender_picture,
        receiver.username as receiver_name,
        receiver.profile_picture_url as receiver_picture
      FROM messages m
      JOIN users sender ON m.sender_id = sender.id
      JOIN users receiver ON m.receiver_id = receiver.id
      WHERE m.id = ?`,
      [result.insertId]
    );
    
    // Emit socket event
    const io = req.app.get('io');
    const chatId = [senderId, receiverId].sort().join('-');
    io.to(chatId).emit('receive_message', messages[0]);
    
    res.status(201).json(messages[0]);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Error sending message' });
  }
});

// Get user info for chat
router.get('/user/:userId', authenticateToken, async (req, res) => {
  try {
    const userId = parseInt(req.params.userId, 10);
    
    // Validate userId is a valid integer
    if (isNaN(userId) || userId <= 0) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }
    
    const [users] = await db.query(
      'SELECT id, username, profile_picture_url FROM users WHERE id = ?',
      [userId]
    );
    
    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(users[0]);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Error fetching user' });
  }
});

export default router;
