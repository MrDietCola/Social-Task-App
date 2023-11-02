const router = require('express').Router();
const { Friends, Task, User } = require('../../models');

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

// Render friend tasks
router.get('/friends', async (req, res) => {
  try {
    const friend = await Friends.findAll(req.params.id, {
      include: {
        model: User,
        include: Task,
        foreignKey: friend_id,
      },
    });
    res.render('friendTasks', { friend });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});




module.exports = router;



router.get('/project/:id', async (req, res) => {
  try {
    const projectData = await Project.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ['name'],
        },
      ],
    });

    const project = projectData.get({ plain: true });

    res.render('project', {
      ...project,
      logged_in: req.session.logged_in
    });
  } catch (err) {
    res.status(500).json(err);
  }
});