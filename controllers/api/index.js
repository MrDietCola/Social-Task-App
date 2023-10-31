const router = require('express').Router();
const userRoutes = require('./userRoutes');
const tasksRoutes = require('./taskRoutes');
const friendsRoutes = require('./friendsRoutes')

router.use('/users', userRoutes);
router.use('/tasks', tasksRoutes);
router.use('/friends', friendsRoutes);

module.exports = router;
