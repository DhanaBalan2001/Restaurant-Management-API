import Order from '../models/Order.js';
import { notifyKitchen, notifyOrderUpdate } from '../services/socket.js';

export const createOrder = async (req, res) => {
  try {
      if (req.user.role !== 'client') {
          return res.status(403).json({ message: "Only clients can place orders" });
      }
      const newOrder = await Order.create(req.body);
      
      // Notify kitchen about new order
      notifyKitchen(newOrder);
      
      res.status(201).json(newOrder);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};

export const getAllOrders = async (req, res) => {
  try {
      const orders = await Order.find()
          .populate('items.menuItem')
          .populate('user');
      res.json(orders);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
      const order = await Order.findById(req.params.id)
          .populate('items.menuItem')
          .populate('user');
      if (!order) {
          return res.status(404).json({ message: "Order not found" });
      }
      res.json(order);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
      const { status } = req.body;
      const updatedOrder = await Order.findByIdAndUpdate(
          req.params.id,
          { status },
          { new: true }
      );

      // Notify about status change
      notifyOrderUpdate(updatedOrder._id, status);

      res.json(updatedOrder);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};

export const getUserOrders = async (req, res) => {
  try {
      const orders = await Order.find({ user: req.user.userId })
          .populate('items.menuItem')
          .sort('-createdAt');
      res.json(orders);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};