const { User, Thought } = require('../models');

const userController = {
  getAllUsers(req, res) {
    User.find()
      .populate('thoughts')
      .populate('friends')
      .select('-__v')
      .then((users) => res.json(users))
      .catch((err) => {
        console.error(err);
        res.status(500).json(err);
      });
  },

  getUserById(req, res) {
    const userId = req.params.id;

    User.findById(userId)
      .populate('thoughts')
      .populate('friends')
      .select('-__v')
      .then((user) => {
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json(err);
      });
  },

  createUser(req, res) {
    const { username, email } = req.body;

    User.create({ username, email })
      .then((user) => res.json(user))
      .catch((err) => {
        console.error(err);
        res.status(500).json(err);
      });
  },

  updateUser(req, res) {
    const userId = req.params.id;
    const { username, email } = req.body;

    User.findByIdAndUpdate(userId, { username, email }, { new: true, runValidators: true })
      .then((user) => {
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json(err);
      });
  },

  deleteUser(req, res) {
    const userId = req.params.id;

    User.findByIdAndDelete(userId)
      .then((user) => {
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
        // Remove user's associated thoughts
        return Thought.deleteMany({ _id: { $in: user.thoughts } });
      })
      .then(() => res.json({ message: 'User and associated thoughts deleted successfully' }))
      .catch((err) => {
        console.error(err);
        res.status(500).json(err);
      });
  },

  addFriend(req, res) {
    const { userId, friendId } = req.params;

    User.findByIdAndUpdate(userId, { $addToSet: { friends: friendId } }, { new: true })
      .then((user) => {
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json(err);
      });
  },

  removeFriend(req, res) {
    const { userId, friendId } = req.params;

    User.findByIdAndUpdate(userId, { $pull: { friends: friendId } }, { new: true })
      .then((user) => {
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json(err);
      });
  }
};

module.exports = userController;
