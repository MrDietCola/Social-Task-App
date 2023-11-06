const router = require('express').Router();
const { Task, TaskTag } = require('../../models');
const withAuth = require('../../utils/auth');

router.post('/', withAuth, async (req, res) => {
  try {
    const newTask = await Task.create({
      ...req.body,
      author_id: req.session.user.id,
    });

    res.status(200).json(newTask);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.delete('/:id', withAuth, async (req, res) => {
  try {
    const taskData = await Task.destroy({
      where: {
        id: req.params.id,
        user_id: req.session.user_id,
      },
    });

    if (!taskData) {
      res.status(404).json({ message: 'No task found with this id!' });
      return;
    }

    res.status(200).json(taskData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/tag/:id', async (req, res) => {
  try {
    const taskTagData = await TaskTag.create({
      ...req.body,
      task_id: req.params.id
    })
    res.status(200).json(taskTagData);
  } catch (err) {
    res.status(500).json(err);
  }

});

router.put('/', async (req, res) => {
  try {
    const taskData = await Task.update({
      title: req.body.title,
      description: req.body.description,
      state: req.body.state,
      public: req.body.public
    },
      {
        where: { id: req.body.id }
      });

      console.log(req.body.id, req.body);
    res.status(200).json(taskData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete('/tag/:id', async (req, res) => {
  try {
    const taskTagData = await TaskTag.destroy({
      where: {
        task_id: req.params.id,
        tag_id: req.body.tag_id
      }
    })
    res.status(200).json(taskTagData);
  } catch (err) {
    res.status(500).json(err);
  }

});

module.exports = router;
