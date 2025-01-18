import User from '../models/User.js';
import Order from '../models/Order.js';

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    const usersByRole = {
      clients: users.filter(user => user.role === 'client'),
      staff: users.filter(user => user.role === 'staff'),
      managers: users.filter(user => user.role === 'manager'),
      admins: users.filter(user => user.role === 'admin')
    };
    res.json(usersByRole);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getClientStats = async (req, res) => {
  try {
    const stats = await Order.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'userDetails'
        }
      },
      {
        $group: {
          _id: '$user',
          totalOrders: { $sum: 1 },
          totalSpent: { $sum: '$totalAmount' },
          lastOrder: { $max: '$createdAt' },
          userInfo: { $first: '$userDetails' }
        }
      }
    ]);
    
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAnalytics = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalClients = await User.countDocuments({ role: 'client' });
    const revenue = await Order.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    
    const topClients = await Order.aggregate([
      {
        $group: {
          _id: '$user',
          orderCount: { $sum: 1 },
          totalSpent: { $sum: '$totalAmount' }
        }
      },
      { $sort: { totalSpent: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'userDetails'
        }
      }
    ]);
    
    res.json({
      totalOrders,
      totalClients,
      revenue: revenue[0]?.total || 0,
      topClients
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};