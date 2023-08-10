const router = require('express').Router();
const {
  getAllThoughts,
  getThoughtById,
  createThought,
  updateThought,
  deleteThought,
  addReaction,
  removeReaction
} = require('../../controllers/thought-controller');

// Define API routes for thoughts
router.get('/thoughts', getAllThoughts);
router.get('/thoughts/:id', getThoughtById);
router.post('/thoughts', createThought);
router.put('/thoughts/:id', updateThought);
router.delete('/thoughts/:id', deleteThought);
router.post('/thoughts/:thoughtId/reactions', addReaction);
router.delete('/thoughts/:thoughtId/reactions/:reactionId', removeReaction);

module.exports = router;
