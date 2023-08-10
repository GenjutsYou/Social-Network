const mongoose = require('mongoose');
const { User, Thought } = require('../models');

mongoose.connect('mongodb://localhost:27017/social-network-api', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
});

const userData = require('./userData.json');
const thoughtData = require('./thoughtData.json');
const reactionData = require('./reactionData.json');

async function seedDatabase() {
  try {
    // Insert users from user seed data
    await User.insertMany(userData);

    // Insert thoughts from thought seed data
    const thoughtsWithUserIds = thoughtData.map(thought => ({
      ...thought,
      userId: getUserIdByUsername(thought.username)
    }));
    await Thought.insertMany(thoughtsWithUserIds);

    // Insert reactions from reaction seed data
    const reactionsWithThoughtIds = reactionData.map(reaction => ({
      ...reaction,
      thoughtId: getThoughtIdByThoughtText(reaction.thoughtText)
    }));
    await Reaction.insertMany(reactionsWithThoughtIds);

    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    mongoose.disconnect();
  }
}

async function getUserIdByUsername(username) {
    const user = await User.findOne({ username }).select('_id').lean();
    return user ? user._id : null;
  }
  
  async function getThoughtIdByThoughtText(thoughtText) {
    const thought = await Thought.findOne({ thoughtText }).select('_id').lean();
    return thought ? thought._id : null;
  }  

seedDatabase();
