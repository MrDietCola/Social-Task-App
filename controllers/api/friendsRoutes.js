const router = require('express').Router();

const { Friends, Task, Tag, TaskTag, User } = require('../../models');


// CREATE one friend
router.post('/', async (req, res) => {
  try {
    const friendsData = await Friends.create(req.body);
    res.status(200).json(friendsData);
  } catch (err) {
    res.status(400).json(err);
  }
});

// Delete a friend
router.delete('/:id', async (req, res) => {
  try {
    const friendsData = await Friends.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (!friendsData) {
      res.status(404).json({ message: 'No friends found with that id!' });
      return;
    }
    res.status(200).json(friendsData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
