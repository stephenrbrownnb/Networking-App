const { Thought, User } = require('../models');

module.exports = {
  getAllThoughts(req, res) {
    Thought.find()
      .then((thoughts) => res.json(thoughts))
      .catch((err) => res.status(500).json(err));
  },
  getThoughtById(req, res) {
    Thought.findById(req.params.id)
      // .select('-__v')
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: 'No thought with that ID' })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },
  createThought(req, res) {
    Thought.create(req.body)
      .then((thought) => res.json(thought))
      .catch((err) => res.status(500).json(err));
  },
  updateThought(req, res) {
    Thought.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: 'Thought not found' })
          : res.json({ thought })
      )
      .catch((err) => res.status(500).json(err));
  },
  deleteThought(req, res) {
    Thought.deleteOne({ _id: req.params.id })
      .then((thought) =>
        !thought
        ? res.status(404).json({ message: 'Thought not found' })
        : res.json({ thought })
      )
      .catch((err) => res.status(500).json(err));
  },
  createReaction(req, res) {
    Thought.findByIdAndUpdate(req.params.id, {$addToSet: { reactions: req.body }}, { runValidators: true, new: true })
    .then((reaction) =>
      !reaction
        ? res.status(404).json({ message: 'No thought found with that ID' })
        : res.json({ reaction })
    )
    .catch((err) => res.status(500).json(err));
  },
  deleteReaction(req, res) {
    Thought.findByIdAndUpdate(req.params.id, {$pull: { reactions: { reactionId: req.params.reactionId} }}, { runValidators: true, new: true })
      .then((reaction) =>
        !reaction
          ? res.status(404).json({ message: 'No reaction found with that ID' })
          : res.json({ message: `Reaction ${req.params.reactionId} successfully deleted.` })
      )
      .catch((err) => res.status(500).json(err));
  }
}