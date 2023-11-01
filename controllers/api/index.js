const router = require('express').Router();
const userRoutes = require('./userRoutes');
const tasksRoutes = require('./taskRoutes');
const friendsRoutes = require('./friendsRoutes')
const tagRoutes = require('./tagRoutes')

router.use('/users', userRoutes);
router.use('/tasks', tasksRoutes);
router.use('/friends', friendsRoutes);
router.use('/tags', tagRoutes);

module.exports = router;
