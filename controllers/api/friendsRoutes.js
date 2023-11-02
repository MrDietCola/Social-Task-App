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

// delete a friend
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


router.get('/friends/:id', async (req, res) => {
  try {
    const friendsData = await Friends.findAll({
      where: {
        user_id: req.params.id
      },
      include: [
        {
          model: User,
          foreignKey: 'friend_id',
          attributes: { exclude: ['password'] },
          include: [
            {
              model: Task,
              required: false,
              where: { public: true }
            },
          ]
        },
      ]
    });
    console.log(friendsData);
    res.status(200).json(friendsData);
  } catch (err) {
    res.status(400).json(err);
  }
});



router.get('/', async (req, res) => {
  try {
    const friendsData = await Friends.findAll({
      include: [
        {
          model: Task,
          through: TaskTag,
          as: 'tag_by_taskTag',
          include: [
            {
              model: User,
              attributes: ['username']
            },
            {
              model: Tag,
              through: TaskTag,
              attributes: ['tag_name', 'id'],
              as: 'task_by_taskTag'
            },
          ]
        },
      ]
    });
    console.log(friendsData);
    res.status(200).json(friendsData);
  } catch (err) {
    res.status(400).json(err);
  }
});




module.exports = router;
