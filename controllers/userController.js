const User = require('../models/User');

module.exports = {
  getAllUsers: (req, res) => {
    User.find()
      .then((users) => res.json(users))
      .catch((err) => res.status(500).json(err));
  },

  getUserById: (req, res) => {
    User.findById(req.params.id)
      .then((user) => {
        if (!user) {
          res.status(404).json({ message: 'No user found with this id!' });
          return;
        }
        res.json(user);
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  },

  createUser: (req, res) => {
    User.create(req.body)
      .then((user) => res.json(user))
      .catch((err) => res.status(400).json(err));
  },

  updateUser: (req, res) => {
    User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      .then((user) => {
        if (!user) {
          res.status(404).json({ message: 'No user found with this id!' });
          return;
        }
        res.json(user);
      })
      .catch((err) => res.status(400).json(err));
  },

  deleteUser: (req, res) => {
    User.findByIdAndDelete(req.params.id)
      .then((user) => {
        if (!user) {
          res.status(404).json({ message: 'No user found with this id!' });
          return;
        }
        return User.updateMany(
          { _id: { $in: user.friends } },
          { $pull: { friends: req.params.id } }
        ).then(() => Thought.deleteMany({ username: user.username }));
      })
      .then(() => res.json({ message: 'User and associated thoughts successfully deleted!' }))
      .catch((err) => res.status(400).json(err));
  },
  
  addFriend: (req, res) => {
    User.findByIdAndUpdate(
      req.params.userId,
      { $addToSet: { friends: req.params.friendId } },
      { new: true }
    )
      .populate({ path: 'friends', select: '-__v' })
      .select('-__v')
      .then((user) => {
        if (!user) {
          res.status(404).json({ message: 'No user found with this id!' });
          return;
        }
        res.json(user);
      })
      .catch((err) => res.status(400).json(err));
  },

  removeFriend: (req, res) => {
    User.findByIdAndUpdate(
      req.params.userId,
      { $pull: { friends: req.params.friendId } },
      { new: true }
    )
      .populate({ path: 'friends', select: '-__v' })
      .select('-__v')
      .then((user) => {
        if (!user) {
          res.status(404).json({ message: 'No user found with this id!' });
          return;
        }

        res.json({ message: 'Friend successfully removed!', user });
      })
      .catch((err) => res.status(400).json(err));
  },
};
