const { Thought, User } = require('../models');

const thoughtController = {
  getAllThoughts(req, res) {
    Thought.find()
      .populate('reactions')
      .select('-__v')
      .then((thoughts) => res.json(thoughts))
      .catch((err) => {
        console.error(err);
        res.status(500).json(err);
      });
  },

  getThoughtById(req, res) {
    const thoughtId = req.params.id;

    Thought.findById(thoughtId)
      .populate('reactions')
      .select('-__v')
      .then((thought) => {
        if (!thought) {
          return res.status(404).json({ message: 'Thought not found' });
        }
        res.json(thought);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json(err);
      });
  },

  createThought(req, res) {
    const { thoughtText, username, userId } = req.body;

    Thought.create({ thoughtText, username, userId })
      .then((thought) => {
        // Push the created thought's _id to the associated user's thoughts array field
        return User.findByIdAndUpdate(userId, { $push: { thoughts: thought._id } }, { new: true });
      })
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

  updateThought(req, res) {
    const thoughtId = req.params.id;
    const { thoughtText } = req.body;

    Thought.findByIdAndUpdate(thoughtId, { thoughtText }, { new: true, runValidators: true })
      .then((thought) => {
        if (!thought) {
          return res.status(404).json({ message: 'Thought not found' });
        }
        res.json(thought);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json(err);
      });
  },

  deleteThought(req, res) {
    const thoughtId = req.params.id;

    Thought.findByIdAndDelete(thoughtId)
      .then((thought) => {
        if (!thought) {
          return res.status(404).json({ message: 'Thought not found' });
        }
        // Remove the thought from the user's thoughts array field
        return User.findByIdAndUpdate(thought.userId, { $pull: { thoughts: thoughtId } }, { new: true });
      })
      .then((user) => {
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'Thought and its associations deleted successfully' });
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json(err);
      });
  },

  addReaction(req, res) {
    const thoughtId = req.params.thoughtId;
    const { reactionBody, username } = req.body;

    Thought.findByIdAndUpdate(
      thoughtId,
      { $push: { reactions: { reactionBody, username } } },
      { new: true, runValidators: true }
    )
      .then((thought) => {
        if (!thought) {
          return res.status(404).json({ message: 'Thought not found' });
        }
        res.json(thought);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json(err);
      });
  },

  removeReaction(req, res) {
    const thoughtId = req.params.thoughtId;
    const reactionId = req.params.reactionId;

    Thought.findByIdAndUpdate(
      thoughtId,
      { $pull: { reactions: { reactionId } } },
      { new: true, runValidators: true }
    )
      .then((thought) => {
        if (!thought) {
          return res.status(404).json({ message: 'Thought not found' });
        }
        res.json(thought);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json(err);
      });
  }
};

module.exports = thoughtController;
