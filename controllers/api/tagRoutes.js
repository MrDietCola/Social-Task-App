const router = require('express').Router();
const { Tag, Task, TaskTag } = require('../../models');
const withAuth = require('../../utils/auth');

// GET all tags and associated tasks
router.get('/', async (req, res) => {
  try {
    const userData = await Tag.findAll({
      include: [
        { model: Task, through: TaskTag, as: 'tag_by_taskTag' },
      ]
    });
    res.status(200).json(userData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET one tag and associated tasks
router.get('/:id', async (req, res) => {
  try {
    const data = await Tag.findByPk(req.params.id, {
      include: [
        { model: Task, through: TaskTag, as: 'tag_by_taskTag' },
      ]
    });
    const tagsData = data.get({ plain: true });
    const tags = tagsData.tag_by_taskTag

    res.status(200).json(tags);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/', withAuth, async (req, res) => {
  try {
    const newTag = await Tag.create({
      ...req.body,
      user_id: req.session.user_id,
    });

    res.status(200).json(newTag);
  } catch (err) {
    console.error(err);
    res.status(400).json(err);
  }
});

router.delete('/:id', withAuth, async (req, res) => {
  try {
    const tagData = await Tag.destroy({
      where: {
        id: req.params.id,
        user_id: req.session.user_id,
      },
    });

    if (!tagData) {
      res.status(404).json({ message: 'No project found with this id!' });
      return;
    }

    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
