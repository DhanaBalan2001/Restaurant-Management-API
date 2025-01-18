import Branch from '../models/Branch.js';

export const createBranch = async (req, res) => {
  try {
    const newBranch = await Branch.create(req.body);
    res.status(201).json(newBranch);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBranchStats = async (req, res) => {
  try {
    const { branchId } = req.params;
    
    const stats = await Order.aggregate([
      { $match: { branch: mongoose.Types.ObjectId(branchId) } },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          revenue: { $sum: '$totalAmount' },
          averageOrder: { $avg: '$totalAmount' }
        }
      }
    ]);

    res.json(stats[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
